import mongoose from 'mongoose'

const convertToObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id)
}
const cleanedMessage = (message: string) => {
  return message.replace(/"/g, '').replace(/^\w/, (c) => c.toUpperCase())
}

export { convertToObjectId, cleanedMessage }
