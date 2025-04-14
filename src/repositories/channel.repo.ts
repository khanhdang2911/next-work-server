import { Types } from 'mongoose'
import { Channel } from '~/models/channel.model'

const checkUserAlreadyInChannel = async (
  workspaceId: Types.ObjectId,
  channelId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const checkUserExisted = await Channel.exists({
    _id: channelId,
    workspaceId,
    'members.user': userId
  })
  return checkUserExisted
}
export { checkUserAlreadyInChannel }
