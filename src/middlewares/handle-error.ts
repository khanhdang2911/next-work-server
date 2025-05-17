import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import dotenv from 'dotenv'
dotenv.config()
const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorResponse(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, req)
  next(error)
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleError = (err: ErrorResponse, req: Request, res: Response, next: NextFunction): void => {
  // err =
  //   err instanceof ErrorResponse
  //     ? err
  //     : new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, req)
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  const errorMessage = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: errorMessage,
    stack: err.stack
  })
}

export { handleNotFound, handleError }
