import logger from '~/loggers/winston.log'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()
class ErrorResponse extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public request?: Request
  ) {
    super(message)
    this.statusCode = statusCode
    if (process.env.ENVIRONMENT !== 'production') {
      const traceId = uuidv4()
      const messageLog = `${traceId} ${this.statusCode.toString()} - ${this.message} - ${this.request?.originalUrl ?? ''} - ${this.request?.method ?? ''} - ${this.request?.ip ?? ''}`
      const metadata = request && request.method === 'POST' ? request.body : request?.query
      logger.error(messageLog)
      logger.error(`${traceId} - ${JSON.stringify(metadata)}`)
    }
  }
}

export default ErrorResponse
