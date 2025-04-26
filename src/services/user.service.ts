import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import ErrorResponse from '~/core/error.response'
import { User } from '~/models/user.model'
import { Workspace } from '~/models/workspace.model'
import { convertToObjectId } from '~/utils/common'

const getALlUsersService = async () => {
  const users = await User.find()
  return users
}

const searchUserService = async (keyword: string, userId: string) => {
  const users = await User.find({
    $text: {
      $search: keyword
    }
  }).select('name email avatar gender')
  return users.filter((user) => user._id.toString() !== userId)
}

const getUserByIdService = async (id: string) => {
  const user = await User.findById(id).select('name email avatar').lean()
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
  return user
}
export { getALlUsersService, searchUserService, getUserByIdService }
