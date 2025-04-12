import mongoose, { Schema } from 'mongoose'

const COLLECTION_NAME = 'read_statuses'
const DOCUMENT_NAME = 'read_status'

interface IReadStatus {
  chat_id: string
  user_id: string
  last_message_id: string
}

const ReadStatusSchema = new Schema<IReadStatus>(
  {
    chat_id: {
      type: String,
      required: true,
      ref: 'chat'
    },
    user_id: {
      type: String,
      required: true,
      ref: 'user'
    },
    last_message_id: {
      type: String,
      required: true,
      ref: 'message'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const ReadStatus = mongoose.model<IReadStatus>(DOCUMENT_NAME, ReadStatusSchema)
ReadStatusSchema.index({ chat_id: 1, user_id: 1, last_message_id: 1 }, { unique: true })
export { ReadStatus, IReadStatus }
