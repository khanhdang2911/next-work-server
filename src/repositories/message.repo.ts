import { Types } from 'mongoose'
import { Message } from '~/models/message.model'

const getMessagesByConversationId = async (conversationId: Types.ObjectId, page: number, limit: number) => {
  const messages = await Message.find({
    conversationId
  })
    .populate('senderId', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
  return messages.reverse() // Reverse to get the oldest messages first
}

export { getMessagesByConversationId }
