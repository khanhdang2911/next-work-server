import { Response, Request } from 'express'
import logger from '~/loggers/winston.log'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()
class SuccessResponse {
  public constructor(
    public statusCode: number,
    public message: string,
    public data?: object,
    public options?: object
  ) {}
  public send = (res: Response) => {
    res.status(this.statusCode).json({
      status: 'success',
      message: this.message,
      data: this.data,
      options: this.options
    })
    if (process.env.ENVIRONMENT !== 'production') {
      const req: Request = res.req
      const traceId = uuidv4()
      const messageLog = `${traceId} - ${this.statusCode.toString()} - ${this.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      const metadata = req.method === 'POST' ? req.body : req.query
      logger.info(messageLog)
      logger.info(`${traceId} - ${JSON.stringify(metadata)}`)
    }
  }
}

export default SuccessResponse
