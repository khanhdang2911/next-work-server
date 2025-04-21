import { Router } from 'express'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import * as messageController from '~/controllers/message.controller'
import uploadCloud from '~/configs/cloudinary.init'
const messageRouter = Router()
messageRouter.use(asyncErrorHandler(authMiddleware))
messageRouter.post('/', uploadCloud.array('files', 5), asyncErrorHandler(messageController.createMessage))
messageRouter.get('/:conversationId', asyncErrorHandler(messageController.getMessages))
export default messageRouter
