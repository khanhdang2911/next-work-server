import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/core/success.response'
import * as messageService from '~/services/message.service'
const createMessage = async (req: Request, res: Response) => {
  const userId = req.userId
  const data = req.body
  const files = req.files as Express.Multer.File[]
  const message = await messageService.createMessageService(userId, data, files)
  new SuccessResponse(StatusCodes.CREATED, ReasonPhrases.OK, message).send(res)
}

const getMessages = async (req: Request, res: Response) => {
  const userId = req.userId
  const { conversationId } = req.params
  const { page, limit } = req.query
  const parsedPage = page ? Number(page) : undefined
  const parsedLimit = limit ? Number(limit) : undefined
  const messages = await messageService.getMessagesService(userId, conversationId, parsedPage, parsedLimit)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, messages).send(res)
}

export { createMessage, getMessages }
