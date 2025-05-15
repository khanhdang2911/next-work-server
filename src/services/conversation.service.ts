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
import * as workspaceRepo from '~/repositories/workspace.repo'

const createConversation = async (userId: string, data: ConversationDTO) => {
  const { error } = conversationValidation.createConversationValidation(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }

  const { type, channelId, workspaceId, participants } = data
  const convertedWorkspaceId = convertToObjectId(workspaceId!)
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
      workspaceId: convertedWorkspaceId,
      type,
      participants: {
        $all: convertedParticipants
      }
    })
  }

  if (checkConversationIsExisted) {
    return {
      conversationId: checkConversationIsExisted._id
    }
  }
  // check participants is existed
  if (type === CONVERSATION_TYPE.CHANNEL) {
    const checkChannelIsExist = await channelRepo.checkChannelIsExisted(convertedChannelId!)
    if (!checkChannelIsExist) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CHANNEL_NOT_FOUND)
    }
  } else {
    const users = await User.find({ _id: { $in: convertedParticipants } })
      .select('_id')
      .lean()
    const participantsSet = new Set(participants)

    if (users.length !== participants?.length || !participantsSet.has(userId)) {
      // user not found
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CANNOT_CREATE_CONVERSATION)
    }
    const checkUsersInWorkspace = await workspaceRepo.checkUsersAlreadyInWorkspace(
      convertedWorkspaceId,
      convertedParticipants!
    )
    if (!checkUsersInWorkspace) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_WORKSPACE)
    }
  }
  const conversation = await Conversation.create({
    type,
    channelId: type === CONVERSATION_TYPE.CHANNEL ? convertedChannelId : undefined,
    workspaceId: type === CONVERSATION_TYPE.DIRECT || CONVERSATION_TYPE.CHATBOT ? convertedWorkspaceId : undefined,
    participants: type === CONVERSATION_TYPE.CHANNEL ? [] : convertedParticipants
  })

  return conversation
}
const getDMConversations = async (userId: string, workspaceId: string) => {
  const uId = convertToObjectId(userId)
  const wId = convertToObjectId(workspaceId)
  const dmConversations = await Conversation.aggregate([
    {
      $match: {
        type: CONVERSATION_TYPE.DIRECT,
        workspaceId: wId,
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
