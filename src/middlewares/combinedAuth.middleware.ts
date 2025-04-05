import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import jwt from 'jsonwebtoken'
import auth0Middleware from './auth0.middleware'
import authMiddleware from './auth.middleware'

const combinedAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ErrorResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  }
  const accessToken = authHeader.split(' ')[1]
  const decoded = jwt.decode(accessToken, { complete: true })
  if (!decoded) {
    throw new ErrorResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  }
  if (typeof decoded.payload !== 'string' && decoded.payload.iss === process.env.AUTH0_ISSUER) {
    return auth0Middleware(req, res, next)
  }
  return authMiddleware(req, res, next)
}

export default combinedAuthMiddleware
