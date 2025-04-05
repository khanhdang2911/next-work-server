// import logger from '~/loggers/winston.log'
import { Request } from 'express'
// import { v4 as uuidv4 } from 'uuid'
class ErrorResponse extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public request?: Request
  ) {
    super(message)
    // this.statusCode = statusCode
    // const traceId = uuidv4()
    // const messageLog = `${traceId} ${this.statusCode.toString()} - ${this.message} - ${this.request?.originalUrl ?? ''} - ${this.request?.method ?? ''} - ${this.request?.ip ?? ''}`
    // const metadata = request && request.method === 'POST' ? request.body : request?.query
    // logger.error(messageLog)
    // logger.error(`${traceId} - ${JSON.stringify(metadata)}`)
  }
}

export const ERROR_MESSAGES = {
  // auth
  USER_NOT_FOUND: 'User not found.',
  INVALID_CREDENTIALS: 'Email or password is incorrect.',
  ACCOUNT_NOT_ACTIVATED: 'Your account is not activated, please check your email to activate account and try again',
  EMAIL_ALREADY_EXIST: 'Email is already exist.',
  // mail
  CHECK_EMAIL: 'Please check your email to verify your account and try again...',
  INVALID_OTP: 'Invalid OTP token.',
  // resource
  RESOURCE_ALREADY_EXIST: 'Resource already exists.',
  ROLE_ALREADY_EXIST: 'Role already exists.'
}

export default ErrorResponse
