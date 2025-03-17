import mongoose, { Schema } from 'mongoose'

const COLLECTION_NAME = 'roles'
const DOCUMENT_NAME = 'role'

interface IRole {
  role_name: string
  role_description: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  role_grants?: any
}

const RoleSchema = new Schema<IRole>(
  {
    role_name: {
      type: String,
      required: true
    },
    role_description: {
      type: String,
      required: true
    },
    role_grants: [
      {
        resource: {
          type: String,
          required: true,
          ref: 'resource'
        },
        action: {
          type: String,
          required: true
        },
        attributes: {
          type: String,
          required: true,
          default: '*'
        }
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const Role = mongoose.model<IRole>(DOCUMENT_NAME, RoleSchema)
export { Role, IRole }
