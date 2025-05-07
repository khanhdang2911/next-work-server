import { Router } from 'express'

const conversationRouter = Router()
import * as conversationController from '~/controllers/conversation.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import checkLockAccount from '~/middlewares/check-lock-account'
conversationRouter.use(asyncErrorHandler(authMiddleware))
conversationRouter.use(asyncErrorHandler(checkLockAccount))

// create conversation
conversationRouter.post('/', asyncErrorHandler(conversationController.createConversation))
conversationRouter.get('/dm/:workspaceId', asyncErrorHandler(conversationController.getDMConversations))
export default conversationRouter
