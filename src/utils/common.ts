import mongoose from 'mongoose'
import { containerName } from '~/configs/azure.init'
import emojiRegex from 'emoji-regex'

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

function isEmoji(char: string) {
  const regex = emojiRegex()
  return regex.test(char)
}

export { convertToObjectId, cleanedMessage, extractBlobName, isEmoji }
