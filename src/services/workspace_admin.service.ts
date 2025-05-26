import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import ErrorResponse from '~/core/error.response'
import { ChannelUpdateDTO } from '~/dtos/channel.dto'
import { Channel } from '~/models/channel.model'
import { Conversation } from '~/models/conversation.model'
import { Message } from '~/models/message.model'
import { User } from '~/models/user.model'
import { Workspace } from '~/models/workspace.model'
import { cleanedMessage, convertToObjectId } from '~/utils/common'
import { validateCreateChannel } from '~/validations/channel.validation'
import * as workspaceRepo from '~/repositories/workspace.repo'
import { ROLES } from '~/constants/common.constant'

const getAllChannelsService = async (workspaceId: string, limit: number, page: number, query: string = '') => {
  const queryRegex = new RegExp(query, 'i')
  const skip = (page - 1) * limit
  const wId = convertToObjectId(workspaceId)
  const result = await Channel.aggregate([
    {
      $match: {
        workspaceId: wId,
        name: queryRegex
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin'
      }
    },
    {
      $unwind: '$admin'
    },
    {
      $facet: {
        channels: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              description: 1,
              isActive: 1,
              workspaceId: 1,
              members: { $size: '$members' },
              admin: {
                email: '$admin.email',
                name: '$admin.name'
              },
              createdAt: 1
            }
          }
        ],
        totalCount: [{ $count: 'count' }]
      }
    }
  ])
  const channels = result[0].channels
  const totalDocs = result[0].totalCount[0]?.count ?? 0
  const totalPages = Math.ceil(totalDocs / limit)

  return {
    channels,
    currentPage: page,
    totalPages: totalPages
  }
}

const updateChannelService = async (workspaceId: string, channelId: string, data: ChannelUpdateDTO) => {
  const { error } = validateCreateChannel(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const wId = convertToObjectId(workspaceId)
  const cId = convertToObjectId(channelId)
  const checkNameChannelAlreadyExist = await Channel.exists({
    _id: { $ne: cId },
    name: data.name,
    workspaceId: wId
  }).lean()
  if (checkNameChannelAlreadyExist) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.NAME_CHANNEL_EXISTED)
  }
  const channel = await Channel.findOneAndUpdate({ _id: cId, workspaceId: wId }, { $set: data }, { new: true })
    .select('name description')
    .lean()

  if (!channel) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, ERROR_MESSAGES.UPDATE_CHANNEL_FAILED)
  }
  return channel
}

const deleteChannelService = async (workspaceId: string, channelId: string) => {
  const wId = convertToObjectId(workspaceId)
  const cId = convertToObjectId(channelId)
  const session = await Channel.startSession()
  try {
    await session.withTransaction(async () => {
      await Channel.deleteOne({ _id: cId, workspaceId: wId }).session(session)
      const conversationId = await Conversation.findOne({ channelId: cId }).select('_id').lean()
      await Message.deleteMany({ conversationId: conversationId!._id }).session(session)
      await Conversation.deleteOne({ _id: conversationId!._id }).session(session)
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.DELETE_CHANNEL_FAILED)
  } finally {
    session.endSession()
  }
}

// manage users
const getAllUserInWorkspaceService = async (workspaceId: string, limit: number, page: number, query = '') => {
  const skip = (page - 1) * limit
  const queryRegex = new RegExp(query, 'i')
  const wId = convertToObjectId(workspaceId)

  const result = await Workspace.aggregate([
    { $match: { _id: wId } },
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
      $match: {
        $or: [{ 'userInfo.name': queryRegex }, { 'userInfo.email': queryRegex }]
      }
    },
    {
      $facet: {
        users: [
          { $sort: { 'members.joinedAt': -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: '$userInfo._id',
              name: '$userInfo.name',
              email: '$userInfo.email',
              avatar: '$userInfo.avatar',
              joinedAt: '$members.joinedAt',
              isWorkspaceAdmin: {
                $in: ['$userInfo._id', '$admin']
              }
            }
          }
        ],
        totalCount: [{ $count: 'count' }]
      }
    }
  ])

  const users = result[0].users
  const count = result[0].totalCount[0]?.count ?? 0
  const totalPages = Math.ceil(count / limit)

  return {
    users,
    currentPage: page,
    totalPages
  }
}

const deleteUserInWorkspaceService = async (workspaceId: string, userId: string) => {
  const wId = convertToObjectId(workspaceId)
  const uId = convertToObjectId(userId)
  const session = await User.startSession()
  try {
    await session.withTransaction(async () => {
      const checkUserIsAdminWorkspace = await workspaceRepo.checkUserIsAdminOfWorkspace(wId, uId)
      if (checkUserIsAdminWorkspace) {
        throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CANNOT_DELETE_YOURSELF)
      }
      const checkUserInWorkspace = await workspaceRepo.checkUserAlreadyInWorkspace(wId, uId)
      if (!checkUserInWorkspace) {
        throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_WORKSPACE)
      }
      await Workspace.updateOne({ _id: wId }, { $pull: { members: { user: uId } } }).session(session)
      await Channel.updateMany({ workspaceId: wId }, { $pull: { members: { user: uId } } }).session(session)
    })
  } finally {
    session.endSession()
  }
}

const updateRoleOfUserInWorkspaceService = async (
  workspaceId: string,
  userId: string,
  memberId: string,
  role: string
) => {
  if (userId === memberId) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CANNOT_UPDATE_YOURSELF)
  }
  const wId = convertToObjectId(workspaceId)
  const mId = convertToObjectId(memberId)
  const checkUserInWorkspace = await workspaceRepo.checkUserAlreadyInWorkspace(wId, mId)
  if (!checkUserInWorkspace) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_WORKSPACE)
  }
  if (role === 'admin') {
    await Workspace.updateOne({ _id: wId }, { $addToSet: { admin: mId } })
    await User.updateOne({ _id: mId }, { $addToSet: { roles: ROLES.WORKSPACE_ADMIN } })
  } else if (role === 'member') {
    await Workspace.updateOne({ _id: wId }, { $pull: { admin: mId } })
  } else {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.INVALID_ROLE)
  }
}

export {
  getAllChannelsService,
  updateChannelService,
  deleteChannelService,
  getAllUserInWorkspaceService,
  deleteUserInWorkspaceService,
  updateRoleOfUserInWorkspaceService
}
