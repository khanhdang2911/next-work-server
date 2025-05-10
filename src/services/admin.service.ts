import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import ErrorResponse from '~/core/error.response'
import { UserUpdateAdminDTO } from '~/dtos/user.dto'
import { User } from '~/models/user.model'
import { ROLES } from '~/constants/common.constant'
import { validateUpdateUser } from '~/validations/user.validation'
import { cleanedMessage } from '~/utils/common'
import { Workspace } from '~/models/workspace.model'
import mongoose from 'mongoose'
import { Channel } from '~/models/channel.model'
import { Message } from '~/models/message.model'
import { Conversation } from '~/models/conversation.model'
import { unselectUserFields } from '~/repositories/user.repo'

const getALlUsersService = async (limit: number, page: number, query: string) => {
  const queryRegex = new RegExp(query, 'i')
  const skip = (page - 1) * limit
  const filter = {
    $or: [{ email: queryRegex }, { name: queryRegex }]
  }
  const result = await User.aggregate([
    {
      $match: filter
    },
    {
      $lookup: {
        from: 'workspaces',
        localField: '_id',
        foreignField: 'members.user',
        as: 'workspaces'
      }
    },
    {
      $addFields: {
        numberOfWorkspaces: { $size: '$workspaces' }
      }
    },
    {
      $facet: {
        users: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              ...unselectUserFields,
              workspaces: 0
            }
          }
        ],
        totalCount: [{ $count: 'count' }]
      }
    }
  ])
  const users = result[0].users
  const totalDocs = result[0].totalCount[0]?.count ?? 0
  const totalPages = Math.ceil(totalDocs / limit)
  return {
    users,
    currentPage: page,
    totalPages: totalPages
  }
}

const blockUserService = async (lockUserId: string, userId: string) => {
  if (lockUserId === userId) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CAN_NOT_BLOCK_YOURSELF)
  }
  const user = await User.findByIdAndUpdate(lockUserId, { isLocked: true })
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
}

const unlockUserService = async (unlockUserId: string, userId: string) => {
  if (unlockUserId === userId) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CAN_NOT_UNBLOCK_YOURSELF)
  }
  const user = await User.findByIdAndUpdate(unlockUserId, { isLocked: false })
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
}

const updateUserService = async (updateUserId: string, data: UserUpdateAdminDTO) => {
  const { role, ...rest } = data
  if (role && ![ROLES.ADMIN, ROLES.USER].includes(role as ROLES)) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.INVALID_ROLE)
  }
  const { error } = validateUpdateUser(rest)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  // update role
  if (role === ROLES.ADMIN) {
    await User.findByIdAndUpdate(updateUserId, { $addToSet: { roles: ROLES.ADMIN } })
    await User.findByIdAndUpdate(updateUserId, { $pull: { roles: ROLES.USER } })
  } else if (role === ROLES.USER) {
    await User.findByIdAndUpdate(updateUserId, { $pull: { roles: ROLES.ADMIN } })
    await User.findByIdAndUpdate(updateUserId, { $addToSet: { roles: ROLES.USER } })
  }
  // update another field of user
  const user = await User.findByIdAndUpdate(updateUserId, rest, {
    new: true,
    fields: '-__v -password -refreshToken -accessToken'
  })
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.UPDATE_USER_FAIL)
  }
  return user
}

// workspaces
const getAllWorkspacesService = async (limit: number, page: number, query: string = '') => {
  const queryRegex = new RegExp(query, 'i')
  const skip = (page - 1) * limit
  const result = await Workspace.aggregate([
    {
      $match: {
        name: queryRegex
      }
    },
    {
      $lookup: {
        from: 'channels',
        localField: '_id',
        foreignField: 'workspaceId',
        as: 'channels'
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
      $lookup: {
        from: 'users',
        localField: 'members.user',
        foreignField: '_id',
        as: 'members'
      }
    },
    {
      $unwind: '$admin'
    },
    {
      $addFields: {
        numberOfChannels: { $size: '$channels' },
        numberOfMembers: { $size: '$members' }
      }
    },
    {
      $facet: {
        workspaces: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              __v: 0,
              channels: 0,
              members: 0,
              admin: {
                ...unselectUserFields
              }
            }
          }
        ],
        totalCount: [{ $count: 'count' }]
      }
    }
  ])
  const workspaces = result[0].workspaces
  const totalDocs = result[0].totalCount[0]?.count ?? 0
  const totalPages = Math.ceil(totalDocs / limit)

  return {
    workspaces,
    currentPage: page,
    totalPages
  }
}

const deleteWorkspaceService = async (workspaceId: string) => {
  const session = await mongoose.startSession()
  try {
    await session.withTransaction(async () => {
      const result = await Workspace.deleteOne({ _id: workspaceId }).session(session)
      if (result.deletedCount === 0) {
        throw new Error()
      }
      const channels = await Channel.find({ workspaceId }).session(session)
      const channelIds = channels.map((channel) => channel._id)
      //conversations
      const conversations = await Conversation.find({
        $or: [{ channelId: { $in: channelIds } }, { workspaceId }]
      }).session(session)
      const conversationIds = conversations.map((conversation) => conversation._id)
      await Message.deleteMany({ conversationId: { $in: conversationIds } }).session(session)
      await Conversation.deleteMany({ _id: { $in: conversationIds } }).session(session)
      await Channel.deleteMany({ _id: { $in: channelIds } }).session(session)
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.DELETE_WORKSPACE_FAIL)
  } finally {
    session.endSession()
  }
}
export {
  getALlUsersService,
  blockUserService,
  unlockUserService,
  updateUserService,
  getAllWorkspacesService,
  deleteWorkspaceService
}
