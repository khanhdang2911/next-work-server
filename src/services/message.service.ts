import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import { IAttachment, Message } from '~/models/message.model'
import { cleanedMessage, convertToObjectId, extractBlobName } from '~/utils/common'
import * as messageValidation from '~/validations/message.validation'
import ERROR_MESSAGES from '~/core/error-message'
import { Conversation } from '~/models/conversation.model'
import { CONVERSATION_TYPE } from '~/constants/common.constant'
import * as channelRepo from '~/repositories/channel.repo'
import { MessageDTO, ReactMessageDTO } from '~/dtos/message.dto'
import { deleteFileFromAzure, uploadFileToAzure } from '~/configs/azure.init'
import { ChatBotGenerateText } from '~/configs/chatbot.init'
import { getMessagesByConversationId } from '~/repositories/message.repo'
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

  if (files && files.length > 0) {
    for (const file of files) {
      const sasToken = await uploadFileToAzure(file)

      fileInfos.push({
        name: file.originalname,
        type: file.mimetype,
        size: Math.round((file.size / (1024 * 1024)) * 100) / 100,
        url: sasToken
      })
    }
  }

  const message = await Message.create({
    ...data,
    attachments: fileInfos,
    senderId: uId
  })
  return message
}

const createChatbotMessageService = async (data: MessageDTO, userId: string) => {
  const { error } = messageValidation.validateCreateChatbotMessage(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const { conversationId, content } = data
  const cId = convertToObjectId(conversationId)
  const conversation = await Conversation.findById(conversationId).select('type participants').lean()
  if (
    !conversation ||
    conversation.type !== CONVERSATION_TYPE.CHATBOT ||
    conversation.participants[0].toString() !== userId
  ) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CONVERSATION_NOT_FOUND)
  }
  const response = await ChatBotGenerateText(cId, content)
  const message = await Message.create({
    ...data,
    content: response,
    isChatbot: true
  })
  return message
}

const getMessagesService = async (userId: string, conversationId: string, page: number = 1, limit: number = 100) => {
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
  const messages = getMessagesByConversationId(cId, page, limit)
  return messages
}
const deleteMessageService = async (userId: string, messageId: string) => {
  const uId = convertToObjectId(userId)
  const mId = convertToObjectId(messageId)
  const message = await Message.findOneAndDelete({
    _id: mId,
    senderId: uId
  })
  if (!message) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.MESSAGE_NOT_FOUND)
  }
  //delete file in azure
  if (message.attachments) {
    const attachments = message.attachments
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        const fileName = extractBlobName(attachment.url)
        if (fileName) {
          deleteFileFromAzure(fileName)
        }
      }
    }
  }
  return message
}

const updateMessageService = async (userId: string, messageId: string, data: MessageDTO) => {
  const { error } = messageValidation.validateUpdateMessage(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const uId = convertToObjectId(userId)
  const mId = convertToObjectId(messageId)
  const message = await Message.findOneAndUpdate(
    {
      _id: mId,
      senderId: uId
    },
    {
      ...data,
      isEdited: true
    },
    { new: true }
  )
  if (!message) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.MESSAGE_NOT_FOUND)
  }
  return message
}

const reactMessageService = async (userId: string, messageId: string, data: ReactMessageDTO) => {
  const { error } = messageValidation.validateReactMessage(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const { emoji } = data
  const uId = convertToObjectId(userId)
  const mId = convertToObjectId(messageId)
  const message = await Message.findById(mId)
  if (!message) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.MESSAGE_NOT_FOUND)
  }
  const reaction = message.reactions?.find((r) => r.emoji === emoji)
  const hasReacted = reaction?.users?.some((user) => user.toString() === userId)
  if (!reaction) {
    await Message.updateOne(
      { _id: mId },
      {
        $push: {
          reactions: { emoji, count: 1, users: [uId] }
        }
      }
    )
  } else if (hasReacted) {
    await Message.updateOne(
      { _id: mId, 'reactions.emoji': emoji },
      {
        $inc: { 'reactions.$.count': -1 },
        $pull: { 'reactions.$.users': uId }
      }
    )
  } else {
    await Message.updateOne(
      { _id: mId, 'reactions.emoji': emoji },
      {
        $inc: { 'reactions.$.count': 1 },
        $addToSet: { 'reactions.$.users': uId }
      }
    )
  }

  //delete reaction if this reaction is 0
  return await Message.findOneAndUpdate(
    { _id: mId },
    {
      $pull: {
        reactions: { count: 0 }
      }
    },
    {
      new: true
    }
  )
}
export {
  createMessageService,
  getMessagesService,
  deleteMessageService,
  updateMessageService,
  reactMessageService,
  createChatbotMessageService
}
