import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/core/success.response'
import { IAttachment } from '~/models/message.model'
import * as messageService from '~/services/message.service'
const createMessage = async (req: Request, res: Response) => {
  const userId = req.userId
  const files = req.files as Express.Multer.File[]
  const fileInfos: IAttachment[] = files?.map((file) => ({
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
    url: file.path
  }))
  const data = {
    ...req.body,
    attachments: fileInfos
  }
  const message = await messageService.createMessageService(userId, data)
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
