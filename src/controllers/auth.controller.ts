import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MAX_AGE } from '~/constants/common.constant'
import SuccessResponse from '~/core/success.response'
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
  new SuccessResponse(StatusCodes.OK, 'Login successfully', response).send(res)
}
const Register = async (req: Request, res: Response) => {
  const data = req.body
  const newUser = await registerService(data)
  new SuccessResponse(StatusCodes.CREATED, 'Register successfully', newUser).send(res)
}

const Logout = async (req: Request, res: Response) => {
  const userId = req.userId
  await logoutService(userId, req)
  res.clearCookie('refreshToken')
  new SuccessResponse(StatusCodes.OK, 'Logout successfully').send(res)
}

const generateRefreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  const userId = req.userId
  const newAccessToken = await generateRefreshTokenService(refreshToken!, userId)
  new SuccessResponse(StatusCodes.OK, 'Generate refresh token successfully', newAccessToken).send(res)
}

const LoginWithAuth0 = async (req: Request, res: Response) => {
  const user = req.body
  const response = await loginWithAuth0Service(user)
  new SuccessResponse(StatusCodes.OK, 'Login with Auth0 successfully', response).send(res)
}

export { Login, Register, generateRefreshToken, Logout, LoginWithAuth0 }
