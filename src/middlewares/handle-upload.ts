import { Request, Response, NextFunction } from 'express'
import ErrorResponse from '~/core/error.response'
import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import { uploadManyFile, uploadSingleFile } from '~/configs/azure.init'

export const handleUploadManyFile = (req: Request, res: Response, next: NextFunction) => {
  return uploadManyFile(req, res, (err: any) => {
    if (err?.code === 'LIMIT_FILE_SIZE') {
      return next(new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.FILE_TOO_BIG))
    }

    if (err?.code === 'LIMIT_FILE_COUNT') {
      return next(new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.TOO_MANY_FILES))
    }

    if (err) {
      return next(new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.ERROR_UPLOADING_FILES))
    }
    next()
  })
}

export const handleUploadSingleFile = (req: Request, res: Response, next: NextFunction) => {
  return uploadSingleFile(req, res, (err: any) => {
    if (err?.code === 'LIMIT_FILE_SIZE') {
      return next(new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.FILE_TOO_BIG))
    }

    if (err) {
      console.log(err)
      return next(new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.ERROR_UPLOADING_FILES))
    }
    next()
  })
}
