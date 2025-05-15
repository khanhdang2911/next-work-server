import { Types } from 'mongoose'
import { Message } from '~/models/message.model'

const getMessagesByConversationId = async (conversationId: Types.ObjectId, page: number, limit: number) => {
  return await Message.find({
    conversationId
  })
    .populate('senderId', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: 1 })
    .lean()
}

export { getMessagesByConversationId }
