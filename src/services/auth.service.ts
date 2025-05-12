import { Request } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import ERROR_MESSAGES from '~/core/error-message'
import { IUser, User } from '~/models/user.model'
import { loginValidation, registerValidation } from '~/validations/auth.validation'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import randtoken from 'rand-token'
import { sendMailVerification } from './mail.service'
import { cleanedMessage } from '~/utils/common'
dotenv.config()

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

const generateToken = (payload: object) => {
  const acccessToken = jwt.sign(payload, process.env.SECRET_PASSWORD!, { expiresIn: process.env.EXPIRE_IN })
  return acccessToken
}

const validateToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.SECRET_PASSWORD!)
  return decoded
}

const validateTokenV2 = (token: string) => {
  const decoded = jwt.verify(token, process.env.SECRET_PASSWORD!, { ignoreExpiration: true })
  return decoded
}
const loginService = async (email: string, password: string) => {
  const { error } = loginValidation({ email, password })
  if (error) throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  const user = await User.findOne({ email })
  if (!user) throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.INVALID_CREDENTIALS)
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.INVALID_CREDENTIALS)
  if (user.isLocked) throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.ACCOUNT_IS_BLOCKED)
  if (!user.isActivated) {
    sendMailVerification(email)
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.ACCOUNT_NOT_ACTIVATED)
  }
  const accessToken = generateToken({
    id: user._id,
    email: user.email,
    name: user.name,
    roles: user.roles
  })
  const refreshToken = randtoken.generate(Number(process.env.JWT_REFRESH_TOKEN_SIZE) || 64)
  user.refreshToken = refreshToken
  await user.save()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user.toObject()

  return { ...userWithoutPassword, accessToken }
}
const registerService = async (data: IUser) => {
  const { error } = registerValidation(data)
  if (error) throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  const checkUserIsExist = await User.findOne({ email: data.email })
  if (checkUserIsExist) throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.EMAIL_ALREADY_EXIST)
  const hashedPassword = await hashPassword(data.password)
  const newUser = await User.create({
    ...data,
    password: hashedPassword
  })
  return newUser
}
const logoutService = async (userId: string, req: Request) => {
  const user = await User.findById(userId)
  if (!user) throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  if (user.refreshToken != req.cookies.refreshToken)
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ReasonPhrases.UNAUTHORIZED)
  return true
}

const generateRefreshTokenService = async (refreshToken: string, userId: string) => {
  const user = await User.findById(userId)
  if (!user) throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  if (user.refreshToken !== refreshToken) throw new ErrorResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  const payload = { id: user._id, email: user.email, name: user.name }
  const newAccessToken = generateToken(payload)
  return {
    ...payload,
    accessToken: newAccessToken
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loginWithAuth0Service = async (user: any) => {
  let userInDb = await User.findOne({ email: user.email })
  userInDb ??= await User.create({
    email: user.email,
    name: user.name,
    avatar: user.picture,
    auth0Id: user.sub,
    isActivated: true
  })
  const accessToken = generateToken({
    id: userInDb._id,
    email: userInDb.email,
    name: userInDb.name,
    roles: userInDb.roles
  })
  const refreshToken = randtoken.generate(Number(process.env.JWT_REFRESH_TOKEN_SIZE) || 64)
  userInDb.refreshToken = refreshToken
  await userInDb.save()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = userInDb.toObject()

  return { ...userWithoutPassword, accessToken }
}
export {
  loginService,
  registerService,
  validateToken,
  validateTokenV2,
  generateToken,
  generateRefreshTokenService,
  logoutService,
  loginWithAuth0Service
}
