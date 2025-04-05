import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MAX_AGE } from '~/constants/common.constant'
import SuccessResponse, { SUCCESS_MESSAGES } from '~/core/success.response'
import * as mailService from '~/services/mail.service'
const verifyAccount = async (req: Request, res: Response) => {
  const { token, email } = req.body
  const response = await mailService.verifyAccount(token, email)
  res.cookie('refreshToken', response.refreshToken, {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: MAX_AGE
  })
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.VERIFY_EMAIL_SUCCESS, response).send(res)
}

export { verifyAccount }
