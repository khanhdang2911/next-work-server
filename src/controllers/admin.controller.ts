import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SUCCESS_MESSAGES from '~/core/success-message'
import SuccessResponse from '~/core/success.response'
import * as adminService from '~/services/admin.service'
const getAllUsers = async (req: Request, res: Response) => {
  const users = await adminService.getALlUsersService()
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, users).send(res)
}

const lockUser = async (req: Request, res: Response) => {
  const blockUserId = req.params.lock_userId
  const userId = req.userId
  await adminService.blockUserService(blockUserId, userId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.USER_BLOCKED_SUCCESSFULLY).send(res)
}

const unlockUser = async (req: Request, res: Response) => {
  const unlockUserId = req.params.unlock_userId
  const userId = req.userId
  await adminService.unlockUserService(unlockUserId, userId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.USER_UNBLOCKED_SUCCESSFULLY).send(res)
}

const updateUser = async (req: Request, res: Response) => {
  const updateUserId = req.params.update_userId
  const data = req.body
  const user = await adminService.updateUserService(updateUserId, data)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.UPDATE_USER_SUCCESS, user).send(res)
}

const searchUsers = async (req: Request, res: Response) => {
  const query = req.params.query
  const users = await adminService.searchUsersService(query)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, users).send(res)
}
export { getAllUsers, lockUser, unlockUser, updateUser, searchUsers }
