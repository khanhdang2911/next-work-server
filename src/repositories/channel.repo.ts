import { Types } from 'mongoose'
import { Channel } from '~/models/channel.model'

const checkUserAlreadyInChannel = async (channelId: Types.ObjectId, userId: Types.ObjectId) => {
  const checkUserExisted = await Channel.exists({
    _id: channelId,
    'members.user': userId
  }).lean()
  return checkUserExisted
}

const checkChannelIsExisted = async (channelId: Types.ObjectId) => {
  return await Channel.exists({
    _id: channelId
  }).lean()
}

const checkUserIsAdminOfChannel = async (channelId: Types.ObjectId, userId: Types.ObjectId) => {
  return await Channel.exists({
    _id: channelId,
    admin: userId
  }).lean()
}

const checkUserInInAnyChannelOfWorkspace = async (workspaceId: Types.ObjectId, userId: Types.ObjectId) => {
  const checkUserInChannel = await Channel.exists({
    workspaceId,
    'members.user': userId
  }).lean()
  return checkUserInChannel
}
export {
  checkUserAlreadyInChannel,
  checkChannelIsExisted,
  checkUserIsAdminOfChannel,
  checkUserInInAnyChannelOfWorkspace
}
