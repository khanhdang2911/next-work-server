import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SUCCESS_MESSAGES from '~/core/success-message'
import SuccessResponse from '~/core/success.response'
import { getUserByIdService, searchUserService, updateUserByIdService } from '~/services/user.service'
const searchUser = async (req: Request, res: Response) => {
  const userId = req.userId
  const { keyword, channelId } = req.params
  const users = await searchUserService(keyword, channelId, userId)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, users).send(res)
}

const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id
  const user = await getUserByIdService(id)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, user).send(res)
}

const updateUserById = async (req: Request, res: Response) => {
  const userId = req.userId
  const data = req.body
  const file = req.file ?? null
  const user = await updateUserByIdService(userId, data, file)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.UPDATE_USER_SUCCESS, user).send(res)
}

export { searchUser, getUserById, updateUserById }
