import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import { Conversation } from '~/models/conversation.model'
import { cleanedMessage, convertToObjectId } from '~/utils/common'
import * as conversationValidation from '~/validations/conversation.validation'
import * as channelRepo from '~/repositories/channel.repo'
import { CONVERSATION_TYPE } from '~/constants/common.constant'
import ERROR_MESSAGES from '~/core/error-message'
import { User } from '~/models/user.model'
import { ConversationDTO } from '~/dtos/conversation.dto'

const createConversation = async (userId: string, data: ConversationDTO) => {
  const { error } = conversationValidation.createConversationValidation(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }

  const { type, channelId, participants } = data

  const convertedChannelId = channelId ? convertToObjectId(channelId) : undefined
  const convertedParticipants = participants?.map((id) => convertToObjectId(id))
  // check conversation is existed
  let checkConversationIsExisted = null

  if (type === CONVERSATION_TYPE.CHANNEL) {
    checkConversationIsExisted = await Conversation.exists({
      type,
      channelId: convertedChannelId
    })
  } else {
    checkConversationIsExisted = await Conversation.exists({
      type,
      participants: {
        $all: convertedParticipants,
        $size: convertedParticipants?.length
      }
    })
  }

  if (checkConversationIsExisted) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CONVERSATION_IS_EXISTED)
  }
  // check participants is existed
  if (type === CONVERSATION_TYPE.CHANNEL) {
    const checkChannelIsExist = await channelRepo.checkChannelIsExisted(convertedChannelId!)
    if (!checkChannelIsExist) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CHANNEL_NOT_FOUND)
    }
  } else {
    const users = await User.find({
      _id: { $in: convertedParticipants }
    })
    const participantsSet = new Set(participants)

    if (users.length !== participants!.length || !participantsSet.has(userId)) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
    }
  }
  const conversation = await Conversation.create({
    type,
    channelId: convertedChannelId,
    participants: type === CONVERSATION_TYPE.CHANNEL ? [] : convertedParticipants
  })

  return conversation
}
const getDMConversations = async (userId: string) => {
  const uId = convertToObjectId(userId)
  const dmConversations = await Conversation.aggregate([
    {
      $match: {
        type: CONVERSATION_TYPE.DIRECT,
        participants: {
          $in: [uId]
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants'
      }
    },
    {
      $unwind: '$participants'
    },
    {
      $match: {
        'participants._id': { $ne: uId }
      }
    },
    {
      $project: {
        _id: 0,
        name: '$participants.name',
        avatar: '$participants.avatar',
        status: '$participants.status',
        conversationId: '$_id'
      }
    }
  ])

  return dmConversations
}
export { createConversation, getDMConversations }
