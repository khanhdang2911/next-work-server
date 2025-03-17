import mongoose, { Schema } from 'mongoose'

const COLLECTION_NAME = 'resources'
const DOCUMENT_NAME = 'resource'

interface IResource {
  resource_name: string
  resource_description: string
}

const ResourceSchema = new Schema<IResource>(
  {
    resource_name: {
      type: String,
      required: true
    },
    resource_description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const Resource = mongoose.model<IResource>(DOCUMENT_NAME, ResourceSchema)
export { Resource, IResource }
