import { Types } from 'mongoose'
import { Channel } from '~/models/channel.model'
import { Workspace } from '~/models/workspace.model'

const checkChannelsInWorkspace = async (workspaceId: Types.ObjectId, channels: Types.ObjectId[]) => {
  const checkChannelExisted = await Promise.all(
    channels.map(async (channelId) => {
      return await Channel.exists({
        _id: channelId,
        workspaceId
      })
    })
  )
  const checkResult = checkChannelExisted.every((result) => result !== null)
  return checkResult
}

const checkUserAlreadyInWorkspace = async (workspaceId: Types.ObjectId, userId: Types.ObjectId) => {
  const checkUserExisted = await Workspace.exists({
    _id: workspaceId,
    members: {
      $elemMatch: {
        user: userId
      }
    }
  })
  return checkUserExisted
}

const checkChannelInWorkspace = async (workspaceId: Types.ObjectId, channel: Types.ObjectId) => {
  const checkChannelExisted = await Channel.exists({
    _id: channel,
    workspaceId
  })
  return checkChannelExisted
}

export { checkChannelsInWorkspace, checkUserAlreadyInWorkspace, checkChannelInWorkspace }
