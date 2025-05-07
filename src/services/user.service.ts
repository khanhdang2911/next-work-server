import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import ErrorResponse from '~/core/error.response'
import { User } from '~/models/user.model'
import { UserUpdateDTO } from '~/dtos/user.dto'
import { cleanedMessage, extractBlobName } from '~/utils/common'
import * as userValidation from '~/validations/user.validation'
import { deleteFileFromAzure, uploadFileToAzure } from '~/configs/azure.init'
import { Channel } from '~/models/channel.model'

const searchUserService = async (query: string, channelId: string, userId: string) => {
  const usersInChannel = await Channel.findOne({
    _id: channelId,
    'members.user': userId
  }).select('members.user')
  if (!usersInChannel) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_CHANNEL)
  }
  const regex = new RegExp(query, 'i') // i = case-insensitive
  const usersId = usersInChannel?.members?.map((member) => member.user)
  const users = await User.find({
    _id: { $in: usersId },
    $or: [{ name: regex }, { email: regex }]
  }).select('name avatar')
  return users
}

const getUserByIdService = async (id: string) => {
  const user = await User.findById(id).select('name email avatar status gender').lean()
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
  return user
}

const updateUserByIdService = async (userId: string, data: UserUpdateDTO, file: Express.Multer.File | null) => {
  const { error } = userValidation.validateUpdateUser(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  //upload file to azure
  const user = await User.findById(userId).select('avatar').lean()
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }

  if (file) {
    const sasToken = await uploadFileToAzure(file)
    data.avatar = sasToken
  }

  const userUpdated = await User.findByIdAndUpdate(userId, data, {
    new: true,
    fields: 'name email avatar status gender'
  })
  // delete file from azure
  if (file) deleteFileFromAzure(extractBlobName(user.avatar))
  if (!userUpdated) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.UPDATE_USER_FAIL)
  }
  return userUpdated
}
export { searchUserService, getUserByIdService, updateUserByIdService }
