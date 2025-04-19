import { Router } from 'express'

const conversationRouter = Router()
import * as conversationController from '~/controllers/conversation.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
conversationRouter.use(asyncErrorHandler(authMiddleware))

// create conversation
conversationRouter.post('/', asyncErrorHandler(conversationController.createConversation))
export default conversationRouter
