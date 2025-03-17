import { Router } from 'express'
import { verifyAccount } from '~/controllers/mail.controller'
import asyncErrorHandler from '~/helpers/asyncErrorHandler'
const mailRouter = Router()
mailRouter.post('/verify-account', asyncErrorHandler(verifyAccount))
export default mailRouter
