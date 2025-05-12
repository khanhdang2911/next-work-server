import mongoose, { Types, Schema } from 'mongoose'

const COLLECTION_NAME = 'invitations'
const DOCUMENT_NAME = 'invitation'
interface IInvitation {
  email: string
  workspaceId: Types.ObjectId
  channels: [Types.ObjectId]
  token: string
  expiresAt?: Date
}

const InvitationSchema = new Schema<IInvitation>(
  {
    email: {
      type: String,
      required: true
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'workspace'
    },
    channels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'channel'
      }
    ],
    token: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 50 * 60 * 1000),
      index: { expires: 0 }
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const Invitation = mongoose.model<IInvitation>(DOCUMENT_NAME, InvitationSchema)
export { Invitation, IInvitation }
