import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/core/success.response'
import SUCCESS_MESSAGES from '~/core/success-message'
import * as channelService from '~/services/channel.service'

const createChannel = async (req: Request, res: Response) => {
  const { workspaceId } = req.params
  const userId = req.userId
  const data = req.body
  const channel = await channelService.createChannelService(userId, workspaceId, data)
  new SuccessResponse(StatusCodes.CREATED, SUCCESS_MESSAGES.CREATE_CHANNEL_SUCCESS, channel).send(res)
}

const inviteUserToChannel = async (req: Request, res: Response) => {
  const { workspaceId, channelId } = req.params
  const userId = req.userId
  const data = req.body
  await channelService.inviteUserToChannelService(userId, workspaceId, channelId, data)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.INVITE_USER_TO_CHANNEL_SUCCESS).send(res)
}
export { createChannel, inviteUserToChannel }
