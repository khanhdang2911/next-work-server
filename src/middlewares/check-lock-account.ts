import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import ErrorResponse from '~/core/error.response'
import { User } from '~/models/user.model'
const checkLockAccount = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId
  const user = await User.findById(userId).select('isLocked').lean()
  if (!user || user.isLocked) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ERROR_MESSAGES.ACCOUNT_IS_BLOCKED)
  }
  next()
}

export default checkLockAccount
