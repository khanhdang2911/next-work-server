import { Router } from 'express'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import * as messageController from '~/controllers/message.controller'
import { handleUploadManyFile } from '~/middlewares/handle-upload'
const messageRouter = Router()
messageRouter.use(asyncErrorHandler(authMiddleware))
messageRouter.post('/', handleUploadManyFile, asyncErrorHandler(messageController.createMessage))
messageRouter.get('/:conversationId', asyncErrorHandler(messageController.getMessages))
messageRouter.delete('/:id', asyncErrorHandler(messageController.deleteMessage))
messageRouter.patch('/:id', asyncErrorHandler(messageController.updateMessage))
// react message
messageRouter.put('/:id/react', asyncErrorHandler(messageController.reactMessage))
export default messageRouter
