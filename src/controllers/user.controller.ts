import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import SuccessResponse, { SUCCESS_MESSAGES } from '~/core/success.response'
import { getALlUsersService, searchUserService } from '~/services/user.service'
const getAllUsers = async (req: Request, res: Response) => {
  const users = await getALlUsersService()
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.GET_ALL_USER_SUCCESS, users).send(res)
}

const searchUser = async (req: Request, res: Response) => {
  const userId = req.userId
  const users = await searchUserService(req.params.keyword, userId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.SEARCH_USER_SUCCESS, users).send(res)
}
export { getAllUsers, searchUser }
