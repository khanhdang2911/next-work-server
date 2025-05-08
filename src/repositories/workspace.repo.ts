import { Types } from 'mongoose'
import { Channel } from '~/models/channel.model'
import { Workspace } from '~/models/workspace.model'
import { unselectUserFields } from './user.repo'

const checkChannelsInWorkspace = async (workspaceId: Types.ObjectId, channels: Types.ObjectId[]) => {
  const checkChannelExisted = await Promise.all(
    channels.map(async (channelId) => {
      return await Channel.exists({
        _id: channelId,
        workspaceId
      }).lean()
    })
  )
  const checkResult = checkChannelExisted.every((result) => result !== null)
  return checkResult
}

const checkUserAlreadyInWorkspace = async (workspaceId: Types.ObjectId, userId: Types.ObjectId) => {
  const checkUserExisted = await Workspace.exists({
    _id: workspaceId,
    'members.user': userId
  }).lean()
  return checkUserExisted
}

const checkUsersAlreadyInWorkspace = async (workspaceId: Types.ObjectId, users: Types.ObjectId[]) => {
  return await Workspace.exists({
    _id: workspaceId,
    'members.user': {
      $all: users
    }
  }).lean()
}

const checkChannelInWorkspace = async (workspaceId: Types.ObjectId, channel: Types.ObjectId) => {
  const checkChannelExisted = await Channel.exists({
    _id: channel,
    workspaceId
  }).lean()
  return checkChannelExisted
}

const checkUserIsAdminOfWorkspace = async (workspaceId: Types.ObjectId, userId: Types.ObjectId) => {
  const checkUserExisted = await Workspace.exists({
    _id: workspaceId,
    admin: userId
  }).lean()
  return checkUserExisted
}

const getAllWorkspaceQuery = (limit: number = 15, page: number = 1) => {
  const skip = (page - 1) * limit
  return [
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
    { $skip: skip },
    { $limit: limit },
    {
      $addFields: {
        numberOfChannels: { $size: '$channels' },
        numberOfMembers: { $size: '$members' }
      }
    },
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
  ]
}

export {
  checkChannelsInWorkspace,
  checkUserAlreadyInWorkspace,
  checkChannelInWorkspace,
  checkUsersAlreadyInWorkspace,
  checkUserIsAdminOfWorkspace,
  getAllWorkspaceQuery
}
