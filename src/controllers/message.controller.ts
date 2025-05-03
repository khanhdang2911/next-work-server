import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SUCCESS_MESSAGES from '~/core/success-message'
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

const deleteMessage = async (req: Request, res: Response) => {
  const userId = req.userId
  const { id } = req.params
  const message = await messageService.deleteMessageService(userId, id)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.DELETE_MESSAGE_SUCCESS, message).send(res)
}

const updateMessage = async (req: Request, res: Response) => {
  const userId = req.userId
  const { id } = req.params
  const data = req.body
  const message = await messageService.updateMessageService(userId, id, data)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.UPDATE_MESSAGE_SUCCESS, message).send(res)
}

const reactMessage = async (req: Request, res: Response) => {
  const userId = req.userId
  const { id } = req.params
  const message = await messageService.reactMessageService(userId, id, req.body)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, message!).send(res)
}

export { createMessage, getMessages, deleteMessage, updateMessage, reactMessage }
