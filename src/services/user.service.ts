import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import ErrorResponse from '~/core/error.response'
import { User } from '~/models/user.model'
import { UserUpdateDTO } from '~/dtos/user.dto'
import { cleanedMessage, extractBlobName } from '~/utils/common'
import * as userValidation from '~/validations/user.validation'
import { deleteFileFromAzure, uploadFileToAzure } from '~/configs/azure.init'
const getALlUsersService = async () => {
  const users = await User.find()
  return users
}

const searchUserService = async (keyword: string, userId: string) => {
  const users = await User.find({
    $text: {
      $search: keyword
    }
  }).select('name email avatar gender status')
  return users.filter((user) => user._id.toString() !== userId)
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
  return userUpdated
}
export { getALlUsersService, searchUserService, getUserByIdService, updateUserByIdService }
