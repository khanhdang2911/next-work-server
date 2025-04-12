import mongoose, { Types, Schema } from 'mongoose'

const COLLECTION_NAME = 'channels'
const DOCUMENT_NAME = 'channel'
interface IChannelMember {
  user: Types.ObjectId
  joinedAt: Date
}
interface IChannel {
  name: string
  description?: string
  isPrivate: boolean
  isActive?: boolean
  members?: IChannelMember[]
  workspaceId: Types.ObjectId
  admin: [Types.ObjectId]
}
const ChannelMemberSchema = new Schema<IChannelMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
)
const ChannelSchema = new Schema<IChannel>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: false
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    members: [ChannelMemberSchema],
    workspaceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'workspace'
    },
    admin: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'user'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const Channel = mongoose.model<IChannel>(DOCUMENT_NAME, ChannelSchema)
export { Channel, IChannel, IChannelMember }
