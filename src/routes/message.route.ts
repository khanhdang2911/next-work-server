import { Router } from 'express'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import * as messageController from '~/controllers/message.controller'
const messageRouter = Router()
messageRouter.use(asyncErrorHandler(authMiddleware))
messageRouter.post('/', asyncErrorHandler(messageController.createMessage))
export default messageRouter
