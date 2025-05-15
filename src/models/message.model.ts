import mongoose, { Types, Schema } from 'mongoose'

const COLLECTION_NAME = 'messages'
const DOCUMENT_NAME = 'message'

interface IReaction {
  emoji: string
  count: number
  users: Types.ObjectId[]
}

interface IAttachment {
  name: string
  type: string
  size: number
  url: string
}

interface IMessage {
  content: string
  senderId?: Types.ObjectId
  conversationId: Types.ObjectId
  reactions?: IReaction[]
  attachments?: IAttachment[]
  isEdited?: boolean
  isChatbot?: boolean
}

// Subdocument Schema
const ReactionSchema = new Schema<IReaction>(
  {
    emoji: { type: String, required: true },
    count: { type: Number, default: 0 },
    users: [{ type: Schema.Types.ObjectId, ref: 'user' }]
  },
  { _id: false }
)

const AttachmentSchema = new Schema<IAttachment>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true }
  },
  { _id: false }
)

// Main Schema
const MessageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true },
    senderId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'user'
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    reactions: [ReactionSchema],
    attachments: [AttachmentSchema],
    isEdited: { type: Boolean, default: false },
    isChatbot: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const Message = mongoose.model<IMessage>(DOCUMENT_NAME, MessageSchema)
export { Message, IMessage, IAttachment }
