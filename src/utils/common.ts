import mongoose from 'mongoose'
import { containerName } from '~/configs/azure.init'

const convertToObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id)
}
const cleanedMessage = (message: string) => {
  return message.replace(/"/g, '').replace(/^\w/, (c) => c.toUpperCase())
}

const extractBlobName = (url: string): string => {
  const urlObj = new URL(url)
  const pathname = urlObj.pathname
  const blobName = pathname.replace(`/${containerName}/`, '')
  return decodeURIComponent(blobName)
}
export { convertToObjectId, cleanedMessage, extractBlobName }
