import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import { IAttachment, Message } from '~/models/message.model'
import { cleanedMessage, convertToObjectId } from '~/utils/common'
import * as messageValidation from '~/validations/message.validation'
import ERROR_MESSAGES from '~/core/error-message'
import { Conversation } from '~/models/conversation.model'
import { CONVERSATION_TYPE } from '~/constants/common.constant'
import * as channelRepo from '~/repositories/channel.repo'
import { MessageDTO } from '~/dtos/message.dto'
import { uploadFileToAzure } from '~/configs/azure.init'
const createMessageService = async (userId: string, data: MessageDTO, files: Express.Multer.File[]) => {
  const { error } = messageValidation.validateCreateMessage(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const { conversationId } = data
  const uId = convertToObjectId(userId)
  const conversation = await Conversation.findById(conversationId)
  if (!conversation) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CONVERSATION_NOT_FOUND)
  }
  if (conversation.type === CONVERSATION_TYPE.CHANNEL) {
    const channel = await channelRepo.checkUserAlreadyInChannel(conversation.channelId!, uId)
    if (!channel) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_CHANNEL)
    }
  } else {
    const participantsSet = new Set(conversation.participants.map((id) => id.toString()))
    if (!participantsSet.has(userId)) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_CONVERSATION)
    }
  }
  //upload file --> azure
  const fileInfos: IAttachment[] = []

  for (const file of files) {
    const sasToken = await uploadFileToAzure(file)

    fileInfos.push({
      name: file.originalname,
      type: file.mimetype,
      size: Math.round((file.size / (1024 * 1024)) * 100) / 100,
      url: sasToken
    })
  }

  const message = await Message.create({
    ...data,
    attachments: fileInfos,
    senderId: uId
  })
  return message
}

const getMessagesService = async (userId: string, conversationId: string, page: number = 1, limit: number = 30) => {
  const uId = convertToObjectId(userId)
  const cId = convertToObjectId(conversationId)
  const conversation = await Conversation.findById(cId)
  if (!conversation) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CONVERSATION_NOT_FOUND)
  }
  if (conversation.type === CONVERSATION_TYPE.CHANNEL) {
    const channel = await channelRepo.checkUserAlreadyInChannel(conversation.channelId!, uId)
    if (!channel) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_CHANNEL)
    }
  } else {
    const participantsSet = new Set(conversation.participants.map((id) => id.toString()))
    if (!participantsSet.has(userId)) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_CONVERSATION)
    }
  }
  const messages = await Message.find({
    conversationId: cId
  })
    .populate('senderId', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
  return messages
}

export { createMessageService, getMessagesService }
