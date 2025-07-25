import mongoose, { Types, Schema } from 'mongoose'
import { CONVERSATION_TYPE } from '~/constants/common.constant'

const COLLECTION_NAME = 'conversations'
const DOCUMENT_NAME = 'conversation'
interface IConversation {
  type: string
  channelId?: Types.ObjectId
  workspaceId?: Types.ObjectId
  participants: Types.ObjectId[]
  isChatbot?: boolean
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
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'workspace',
      required: function (this: IConversation) {
        return this.type === CONVERSATION_TYPE.DIRECT || this.type === CONVERSATION_TYPE.CHATBOT
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
    ],
    isChatbot: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const Conversation = mongoose.model<IConversation>(DOCUMENT_NAME, ConversationSchema)
export { Conversation, IConversation }
