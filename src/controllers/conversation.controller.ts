import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/core/success.response'
import * as conversationService from '~/services/conversation.service'
const createConversation = async (req: Request, res: Response) => {
  const data = req.body
  const userId = req.userId
  const conversation = await conversationService.createConversation(userId, data)
  new SuccessResponse(StatusCodes.CREATED, ReasonPhrases.OK, conversation).send(res)
}
const getDMConversations = async (req: Request, res: Response) => {
  const userId = req.userId
  const { workspaceId } = req.params
  const dmConversations = await conversationService.getDMConversations(userId, workspaceId)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, dmConversations).send(res)
}
export { createConversation, getDMConversations }
