import mongoose, { Types, Schema } from 'mongoose'

const COLLECTION_NAME = 'workspaces'
const DOCUMENT_NAME = 'workspace'
interface IWorkspaceMember {
  user: Types.ObjectId
  joinedAt: Date
}
interface IWorkspace {
  name: string
  image?: string
  description?: string
  admin: Types.ObjectId
  members?: IWorkspaceMember[]
}
interface IInviteUserData {
  email: string
  channels?: string[]
}
const WorkspaceMemberSchema = new Schema<IWorkspaceMember>(
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

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    members: [WorkspaceMemberSchema]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const Workspace = mongoose.model<IWorkspace>(DOCUMENT_NAME, WorkspaceSchema)
export { Workspace, IWorkspace, IWorkspaceMember, IInviteUserData }
