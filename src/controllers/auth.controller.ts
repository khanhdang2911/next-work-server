import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MAX_AGE } from '~/constants/common.constant'
import SuccessResponse from '~/core/success.response'
import SUCCESS_MESSAGES from '~/core/success-message'
import {
  generateRefreshTokenService,
  loginService,
  loginWithAuth0Service,
  logoutService,
  registerService
} from '~/services/auth.service'
const Login = async (req: Request, res: Response) => {
  const data = req.body
  const response = await loginService(data.email, data.password)
  res.cookie('refreshToken', response.refreshToken, {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: MAX_AGE
  })
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, response).send(res)
}
const Register = async (req: Request, res: Response) => {
  const data = req.body
  const newUser = await registerService(data)
  new SuccessResponse(StatusCodes.CREATED, SUCCESS_MESSAGES.REGISTER_SUCCESS, newUser).send(res)
}

const Logout = async (req: Request, res: Response) => {
  const userId = req.userId
  await logoutService(userId, req)
  res.clearCookie('refreshToken')
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.LOGOUT_SUCCESS).send(res)
}

const generateRefreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  const userId = req.userId
  const newAccessToken = await generateRefreshTokenService(refreshToken!, userId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.GENERATE_REFRESH_TOKEN_SUCCESS, newAccessToken).send(res)
}

const LoginWithAuth0 = async (req: Request, res: Response) => {
  const user = req.body
  const response = await loginWithAuth0Service(user)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.LOGOUT_SUCCESS, response).send(res)
}

export { Login, Register, generateRefreshToken, Logout, LoginWithAuth0 }
