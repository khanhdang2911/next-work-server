import { Router } from 'express'
import { createChatbotMessage } from '~/controllers/chatbot.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import checkLockAccount from '~/middlewares/check-lock-account'
const chatbotRouter = Router()
chatbotRouter.use(asyncErrorHandler(authMiddleware))
chatbotRouter.use(asyncErrorHandler(checkLockAccount))

chatbotRouter.post('/message', asyncErrorHandler(createChatbotMessage))
export default chatbotRouter
