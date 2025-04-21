import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import SUCCESS_MESSAGES from '~/core/success-message'
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
  new SuccessResponse(StatusCodes.CREATED, SUCCESS_MESSAGES.SEND_MESSAGE_SUCCESS, message).send(res)
}

export { createMessage }
