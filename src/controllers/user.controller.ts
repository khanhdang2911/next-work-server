import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/core/success.response'
import { getALlUsersService, searchUserService } from '~/services/user.service'
const getAllUsers = async (req: Request, res: Response) => {
  const users = await getALlUsersService()
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, users).send(res)
}

const searchUser = async (req: Request, res: Response) => {
  const userId = req.userId
  const users = await searchUserService(req.params.keyword, userId)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, users).send(res)
}
export { getAllUsers, searchUser }
