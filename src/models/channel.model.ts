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
  isActive?: boolean
  members?: IChannelMember[]
  workspaceId: Types.ObjectId
  admin: Types.ObjectId[]
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
      required: true
    },
    description: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      default: false
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
ChannelSchema.index({ _id: 1, members: 1 }, { unique: true })
ChannelSchema.index({ workspaceId: 1, members: 1 }, { unique: true })
ChannelSchema.index({ _id: 1, workspaceId: 1 })
ChannelSchema.index({ _id: 1, admin: 1 }, { unique: true })
const Channel = mongoose.model<IChannel>(DOCUMENT_NAME, ChannelSchema)
export { Channel, IChannel, IChannelMember }
