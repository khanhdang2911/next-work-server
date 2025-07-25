import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import ERROR_MESSAGES from '~/core/error-message'
import { Channel, IChannel, IChannelMember } from '~/models/channel.model'
import { cleanedMessage, convertToObjectId } from '~/utils/common'
import * as channelValidation from '~/validations/channel.validation'
import * as workspaceRepo from '~/repositories/workspace.repo'
import { User } from '~/models/user.model'
import * as channelRepo from '~/repositories/channel.repo'
import * as conversationService from '~/services/conversation.service'
import { ConversationDTO } from '~/dtos/conversation.dto'
import { CONVERSATION_TYPE, ROLES } from '~/constants/common.constant'
const createChannelService = async (userId: string, workspaceId: string, data: IChannel) => {
  const { error } = channelValidation.validateCreateChannel(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const wsId = convertToObjectId(workspaceId)
  const uId = convertToObjectId(userId)
  const checkUserInWorkspace = await workspaceRepo.checkUserAlreadyInWorkspace(wsId, uId)
  if (!checkUserInWorkspace) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_WORKSPACE)
  }
  const checkIsExistChannel = await Channel.exists({
    name: data.name,
    workspaceId: wsId
  }).lean()
  if (checkIsExistChannel) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CHANNEL_EXISTED)
  }
  const firstMember: IChannelMember = {
    user: uId,
    joinedAt: new Date()
  }
  const channel = await Channel.create({
    ...data,
    workspaceId,
    members: [firstMember],
    admin: [uId]
  })
  const conversation: ConversationDTO = {
    type: CONVERSATION_TYPE.CHANNEL,
    channelId: channel._id.toString()
  }
  await conversationService.createConversation(userId, conversation)
  return channel
}

const inviteUserToChannelService = async (
  userId: string,
  workspaceId: string,
  channelId: string,
  data: { email: string }
) => {
  const { error } = channelValidation.validateInviteUserToChannel(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const wsId = convertToObjectId(workspaceId)
  const cId = convertToObjectId(channelId)
  const uId = convertToObjectId(userId)
  const checkUserIsAdminOfChannel = await channelRepo.checkUserIsAdminOfChannel(cId, uId)
  if (!checkUserIsAdminOfChannel) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_WORKSPACE)
  }
  const checkUserInChannel = await channelRepo.checkUserAlreadyInChannel(cId, uId)
  if (!checkUserInChannel) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_CHANNEL)
  }
  const checkChannelInWorkspace = await workspaceRepo.checkChannelInWorkspace(wsId, cId)
  if (!checkChannelInWorkspace) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CHANNEL_NOT_FOUND)
  }
  const invitedUser = await User.exists({ email: data.email }).lean()
  if (!invitedUser) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
  const checkInvitedUserInChannel = await channelRepo.checkUserAlreadyInChannel(cId, invitedUser._id)
  if (checkInvitedUserInChannel) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_ALREADY_IN_CHANNEL)
  }
  const checkInvitedUserInWorkspace = await workspaceRepo.checkUserAlreadyInWorkspace(wsId, invitedUser._id)
  if (!checkInvitedUserInWorkspace) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_WORKSPACE)
  }
  await Channel.updateMany(
    {
      _id: cId,
      workspaceId: wsId
    },
    {
      $addToSet: {
        members: {
          user: invitedUser._id,
          joinedAt: new Date()
        }
      }
    }
  )
}

const getChannelsService = async (userId: string, workspaceId: string) => {
  const wsId = convertToObjectId(workspaceId)
  const uId = convertToObjectId(userId)
  const checkUserInWorkspace = await workspaceRepo.checkUserAlreadyInWorkspace(wsId, uId)
  if (!checkUserInWorkspace) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_WORKSPACE)
  }
  const channels = await Channel.aggregate([
    {
      $match: {
        workspaceId: wsId,
        'members.user': uId
      }
    },
    {
      $lookup: {
        from: 'conversations',
        localField: '_id',
        foreignField: 'channelId',
        as: 'conversation'
      }
    },
    {
      $unwind: '$conversation'
    },
    {
      $project: {
        _id: 1,
        name: 1,
        workspaceId: 1,
        description: 1,
        conversationId: '$conversation._id'
      }
    }
  ])
  return channels
}

const getChannelMembersService = async (userId: string, channelId: string) => {
  const cId = convertToObjectId(channelId)
  const uId = convertToObjectId(userId)
  const checkUserInChannel = await channelRepo.checkUserAlreadyInChannel(cId, uId)
  if (!checkUserInChannel) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_CHANNEL)
  }
  const checkChannel = await channelRepo.checkChannelIsExisted(cId)
  if (!checkChannel) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CHANNEL_NOT_FOUND)
  }
  const members = await Channel.aggregate([
    { $match: { _id: cId } },
    { $unwind: '$members' },
    {
      $lookup: {
        from: 'users',
        localField: 'members.user',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    { $unwind: '$userInfo' },
    {
      $project: {
        _id: '$userInfo._id',
        name: '$userInfo.name',
        email: '$userInfo.email',
        avatar: '$userInfo.avatar',
        gender: '$userInfo.gender',
        status: '$userInfo.status',
        joinedAt: '$members.joinedAt',
        admin: {
          $in: ['$userInfo._id', '$admin']
        }
      }
    }
  ])

  return members
}

const removeUserFromChannel = async (channelId: string, memberId: string) => {
  const cId = convertToObjectId(channelId)
  const mId = convertToObjectId(memberId)
  const checkUserInChannel = await channelRepo.checkUserAlreadyInChannel(cId, mId)
  if (!checkUserInChannel) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_CHANNEL)
  }
  const checkMemberIsAdmin = await channelRepo.checkUserIsAdminOfChannel(cId, mId)
  if (checkMemberIsAdmin) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CAN_NOT_DELETE_YOURSELF)
  }
  await Channel.updateOne(
    {
      _id: cId,
      'members.user': mId
    },
    { $pull: { members: { user: mId } } }
  )
}

const deleteMemberFromChannelService = async (userId: string, channelId: string, memberId: string) => {
  await removeUserFromChannel(channelId, memberId)
}

const leaveChannelService = async (userId: string, channelId: string) => {
  await removeUserFromChannel(channelId, userId)
}

const updateRoleOfMemberInChannelService = async (
  userId: string,
  channelId: string,
  memberId: string,
  role: string
) => {
  if (userId === memberId) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CANNOT_UPDATE_YOURSELF)
  }
  const cId = convertToObjectId(channelId)
  const uId = convertToObjectId(userId)
  const mId = convertToObjectId(memberId)
  const checkUserInChannel = await channelRepo.checkUserAlreadyInChannel(cId, uId)
  if (!checkUserInChannel) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_CHANNEL)
  }
  if (role === 'admin') {
    await Channel.updateOne({ _id: cId }, { $addToSet: { admin: mId } })
    await User.updateOne({ _id: mId }, { $addToSet: { roles: ROLES.CHANNEL_ADMIN } })
  } else if (role === 'member') {
    await Channel.updateOne({ _id: cId }, { $pull: { admin: mId } })
  } else {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.INVALID_ROLE)
  }
}
export {
  createChannelService,
  inviteUserToChannelService,
  getChannelsService,
  getChannelMembersService,
  deleteMemberFromChannelService,
  leaveChannelService,
  updateRoleOfMemberInChannelService
}
