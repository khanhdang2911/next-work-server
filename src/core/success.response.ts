import { Response, Request } from 'express'
// import logger from '~/loggers/winston.log'
// import { v4 as uuidv4 } from 'uuid'
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
    // const req: Request = res.req
    // const traceId = uuidv4()
    // const messageLog = `${traceId} - ${this.statusCode.toString()} - ${this.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    // const metadata = req.method === 'POST' ? req.body : req.query
    // logger.info(messageLog)
    // logger.info(`${traceId} - ${JSON.stringify(metadata)}`)
  }
}

export const SUCCESS_MESSAGES = {
  // auth
  LOGIN_SUCCESS: 'Login successfully.',
  LOGOUT_SUCCESS: 'Logout successfully.',
  REGISTER_SUCCESS: 'Register successfully.',
  GENERATE_REFRESH_TOKEN_SUCCESS: 'Generate refresh token successfully.',
  // mail
  VERIFY_EMAIL_SUCCESS: 'Verify email successfully.',
  // resource
  RESOURCE_CREATED: 'Resource created successfully.',
  RESOURCE_RETRIEVED: 'Resource retrieved successfully.',
  ROLE_CREATED: 'Role created successfully.',
  ROLE_RETRIEVED: 'Role retrieved successfully.',
  // user
  GET_ALL_USER_SUCCESS: 'Get all user successfully.',
  SEARCH_USER_SUCCESS: 'Search user successfully.'
}

export default SuccessResponse
