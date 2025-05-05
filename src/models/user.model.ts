import mongoose, { Schema } from 'mongoose'
import { GENDER, ROLES, USER_STATUS } from '~/constants/common.constant'

const COLLECTION_NAME = 'users'
const DOCUMENT_NAME = 'user'

interface IUser {
  name: string
  email: string
  password: string
  refreshToken: string
  gender: string
  avatar: string
  status: string
  roles: string[]
  auth0Id: string
  isActivated: boolean
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: false
    },
    refreshToken: {
      type: String,
      required: false
    },
    gender: {
      type: String,
      required: false,
      enum: GENDER
    },
    avatar: {
      type: String,
      required: false
    },
    roles: {
      type: [String],
      enum: ROLES,
      required: true,
      default: [ROLES.USER]
    },
    auth0Id: {
      type: String,
      required: false
    },
    isActivated: {
      type: Boolean,
      required: true,
      default: false
    },
    status: {
      type: String,
      enum: USER_STATUS
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const User = mongoose.model<IUser>(DOCUMENT_NAME, UserSchema)
UserSchema.index({ name: 'text', email: 'text' })
export { User, IUser }
