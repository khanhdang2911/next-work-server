import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { MAX_AGE } from '~/constants/common.constant'
import SuccessResponse from '~/core/success.response'
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
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, response).send(res)
}

export { verifyAccount }
