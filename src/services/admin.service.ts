import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import ErrorResponse from '~/core/error.response'
import { UserUpdateAdminDTO } from '~/dtos/user.dto'
import { User } from '~/models/user.model'
import { ROLES } from '~/constants/common.constant'
import { validateUpdateUser } from '~/validations/user.validation'
import { cleanedMessage } from '~/utils/common'
import { Workspace } from '~/models/workspace.model'
import mongoose from 'mongoose'
import { Channel } from '~/models/channel.model'
import { Message } from '~/models/message.model'
import { getAllWorkspaceQuery } from '~/repositories/workspace.repo'
import { getAllUserQuery } from '~/repositories/user.repo'

const getALlUsersService = async (limit: number, page: number) => {
  const users = await User.aggregate([...getAllUserQuery(limit, page)])
  const totalDocs = await User.countDocuments()
  const totalPages = Math.ceil(totalDocs / limit)
  return {
    users,
    currentPage: page,
    totalPages: totalPages
  }
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

const searchUsersService = async (query: string, limit: number, page: number) => {
  const regex = new RegExp(query, 'i')
  const filter = {
    $or: [{ name: regex }, { email: regex }]
  }

  const totalDocs = await User.countDocuments(filter)
  const totalPages = Math.ceil(totalDocs / limit)

  const users = await User.aggregate([{ $match: filter }, ...getAllUserQuery(limit, page)])

  return {
    users,
    currentPage: page,
    totalPages
  }
}

// workspaces
const getAllWorkspacesService = async (limit: number, page: number) => {
  const workspaces = await Workspace.aggregate([...getAllWorkspaceQuery(limit, page)])
  const totalDocs = await Workspace.countDocuments()
  const totalPages = Math.ceil(totalDocs / limit)

  return {
    workspaces,
    currentPage: page,
    totalPages
  }
}

const deleteWorkspaceService = async (workspaceId: string) => {
  const session = await mongoose.startSession()
  try {
    await session.withTransaction(async () => {
      const result = await Workspace.deleteOne({ _id: workspaceId }).session(session)
      if (result.deletedCount === 0) {
        throw new Error()
      }
      await Channel.deleteMany({ workspaceId }).session(session)
      await Message.deleteMany({ workspaceId }).session(session)
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.DELETE_WORKSPACE_FAIL)
  } finally {
    session.endSession()
  }
}

const searchWorkspacesService = async (query: string, limit: number, page: number) => {
  const regex = new RegExp(query, 'i')
  const filter = {
    $or: [{ name: regex }]
  }
  const workspaces = await Workspace.aggregate([
    {
      $match: filter
    },
    ...getAllWorkspaceQuery(limit, page)
  ])
  const totalDocs = await Workspace.countDocuments(filter)
  const totalPages = Math.ceil(totalDocs / limit)
  return {
    workspaces,
    currentPage: page,
    totalPages
  }
}
export {
  getALlUsersService,
  blockUserService,
  unlockUserService,
  updateUserService,
  searchUsersService,
  getAllWorkspacesService,
  deleteWorkspaceService,
  searchWorkspacesService
}
