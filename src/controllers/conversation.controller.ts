import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import SUCCESS_MESSAGES from '~/core/success-message'
import SuccessResponse from '~/core/success.response'
import * as conversationService from '~/services/conversation.service'
const createConversation = async (req: Request, res: Response) => {
  const data = req.body
  const userId = req.userId
  const conversation = await conversationService.createConversation(userId, data)
  new SuccessResponse(StatusCodes.CREATED, SUCCESS_MESSAGES.CREATE_CONVERSATION_SUCCESS, conversation).send(res)
}

export { createConversation }
