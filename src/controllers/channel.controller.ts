import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SUCCESS_MESSAGES from '~/core/success-message'
import SuccessResponse from '~/core/success.response'
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

const getChannels = async (req: Request, res: Response) => {
  const userId = req.userId
  const { workspaceId } = req.params
  const channels = await channelService.getChannelsService(userId, workspaceId)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, channels).send(res)
}

const getChannelMembers = async (req: Request, res: Response) => {
  const userId = req.userId
  const { channelId } = req.params
  const members = await channelService.getChannelMembersService(userId, channelId)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, members).send(res)
}

const deleteMemberFromChannel = async (req: Request, res: Response) => {
  const { channelId, memberId } = req.params
  const userId = req.userId
  await channelService.deleteMemberFromChannelService(userId, channelId, memberId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.DELETE_MEMBER_FROM_CHANNEL_SUCCESS).send(res)
}

const leaveChannel = async (req: Request, res: Response) => {
  const { channelId } = req.params
  const userId = req.userId
  await channelService.leaveChannelService(userId, channelId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.LEAVE_CHANNEL_SUCCESS).send(res)
}
export { createChannel, inviteUserToChannel, getChannels, getChannelMembers, deleteMemberFromChannel, leaveChannel }
