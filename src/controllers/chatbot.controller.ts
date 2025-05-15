import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/core/success.response'
import * as messageService from '~/services/message.service'
const createChatbotMessage = async (req: Request, res: Response) => {
  const userId = req.userId
  const data = req.body
  const message = await messageService.createChatbotMessageService(data, userId)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, message).send(res)
}

export { createChatbotMessage }
