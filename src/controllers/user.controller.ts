import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/core/success.response'
import { getALlUsersService, searchUserService } from '~/services/user.service'
const getAllUsers = async (req: Request, res: Response) => {
  const users = await getALlUsersService()
  new SuccessResponse(StatusCodes.OK, 'Get all user successfully', users).send(res)
}

const searchUser = async (req: Request, res: Response) => {
  const userId = req.userId
  const users = await searchUserService(req.params.keyword, userId)
  new SuccessResponse(StatusCodes.OK, 'Search user successfully', users).send(res)
}
export { getAllUsers, searchUser }
