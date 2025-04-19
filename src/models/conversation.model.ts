import mongoose, { Types, Schema } from 'mongoose'
import { CONVERSATION_TYPE } from '~/constants/common.constant'

const COLLECTION_NAME = 'conversations'
const DOCUMENT_NAME = 'conversation'
interface IConversation {
  type: string
  channelId?: Types.ObjectId
  participants: Types.ObjectId[]
}

const ConversationSchema = new Schema<IConversation>(
  {
    type: {
      type: String,
      required: true,
      enum: CONVERSATION_TYPE
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'channel',
      required: function (this: IConversation) {
        return this.type === CONVERSATION_TYPE.CHANNEL
      }
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: function (this: IConversation) {
          return this.type !== CONVERSATION_TYPE.CHANNEL
        }
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const Conversation = mongoose.model<IConversation>(DOCUMENT_NAME, ConversationSchema)
export { Conversation, IConversation }
