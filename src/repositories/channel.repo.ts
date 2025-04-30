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
export { checkUserAlreadyInChannel, checkChannelIsExisted, checkUserIsAdminOfChannel }
