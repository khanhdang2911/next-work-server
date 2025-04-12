import { Router } from 'express'
import { verifyAccount } from '~/controllers/mail.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
const mailRouter = Router()
mailRouter.post('/verify-account', asyncErrorHandler(verifyAccount))
export default mailRouter
