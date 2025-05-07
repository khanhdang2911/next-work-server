import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import ErrorResponse from '~/core/error.response'
import { UserUpdateAdminDTO } from '~/dtos/user.dto'
import { User } from '~/models/user.model'
import { ROLES } from '~/constants/common.constant'
import { validateUpdateUser } from '~/validations/user.validation'
import { cleanedMessage } from '~/utils/common'

const getALlUsersService = async () => {
  const unselectFields = {
    __v: 0,
    password: 0,
    refreshToken: 0,
    accessToken: 0
  }
  const users = await User.aggregate([
    {
      $lookup: {
        from: 'workspaces',
        localField: '_id',
        foreignField: 'members.user',
        as: 'workspaces'
      }
    },
    {
      $addFields: {
        numberOfWorkspaces: { $size: '$workspaces' }
      }
    },
    {
      $sort: {
        numberOfWorkspaces: -1
      }
    },
    {
      $project: {
        ...unselectFields,
        workspaces: 0
      }
    }
  ])
  return users
}

const blockUserService = async (lockUserId: string, userId: string) => {
  if (lockUserId === userId) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CAN_NOT_BLOCK_YOURSELF)
  }
  const user = await User.findByIdAndUpdate(lockUserId, { isLocked: true })
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
}

const unlockUserService = async (unlockUserId: string, userId: string) => {
  if (unlockUserId === userId) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CAN_NOT_UNBLOCK_YOURSELF)
  }
  const user = await User.findByIdAndUpdate(unlockUserId, { isLocked: false })
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
}

const updateUserService = async (updateUserId: string, data: UserUpdateAdminDTO) => {
  const { role, ...rest } = data
  if (role && ![ROLES.ADMIN, ROLES.USER].includes(role as ROLES)) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.INVALID_ROLE)
  }
  const { error } = validateUpdateUser(rest)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  // update role
  if (role === ROLES.ADMIN) {
    await User.findByIdAndUpdate(updateUserId, { $addToSet: { roles: ROLES.ADMIN } })
    await User.findByIdAndUpdate(updateUserId, { $pull: { roles: ROLES.USER } })
  } else if (role === ROLES.USER) {
    await User.findByIdAndUpdate(updateUserId, { $pull: { roles: ROLES.ADMIN } })
    await User.findByIdAndUpdate(updateUserId, { $addToSet: { roles: ROLES.USER } })
  }
  // update another field of user
  const user = await User.findByIdAndUpdate(updateUserId, rest, {
    new: true,
    fields: '-__v -password -refreshToken -accessToken'
  })
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.UPDATE_USER_FAIL)
  }
  return user
}

const searchUsersService = async (query: string) => {
  const regex = new RegExp(query, 'i') // i = case-insensitive
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }]
  }).select('-__v -password -refreshToken -accessToken')

  return users
}

export { getALlUsersService, blockUserService, unlockUserService, updateUserService, searchUsersService }
