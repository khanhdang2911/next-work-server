import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { JwtPayload } from 'jsonwebtoken'
import ErrorResponse from '~/core/error.response'
import { validateTokenV2 } from '~/services/auth.service'

const authV2Middleware = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]
  if (!accessToken) {
    throw new ErrorResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  }
  const decodedToken = (await validateTokenV2(accessToken)) as JwtPayload
  if (!decodedToken) {
    throw new ErrorResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  }
  const userId = decodedToken.id
  req.userId = userId
  next()
}

export default authV2Middleware
