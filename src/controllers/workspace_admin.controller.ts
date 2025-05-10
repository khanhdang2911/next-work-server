import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SUCCESS_MESSAGES from '~/core/success-message'
import SuccessResponse from '~/core/success.response'
import * as workspaceAdminService from '~/services/workspace_admin.service'

const getAllChannels = async (req: Request, res: Response) => {
  const { workspaceId } = req.params
  const limit = Number(req.query.limit) || 10
  const page = Number(req.query.page) || 1
  const query = req.query.query as string
  const channels = await workspaceAdminService.getAllChannelsService(workspaceId, limit, page, query)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, channels).send(res)
}

const updateChannel = async (req: Request, res: Response) => {
  const { workspaceId, channelId } = req.params
  const data = req.body
  const channel = await workspaceAdminService.updateChannelService(workspaceId, channelId, data)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.UPDATE_CHANNEL_SUCCESS, channel).send(res)
}

const deleteChannel = async (req: Request, res: Response) => {
  const { workspaceId, channelId } = req.params
  await workspaceAdminService.deleteChannelService(workspaceId, channelId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.DELETE_CHANNEL_SUCCESS).send(res)
}

const getAllUserInWorkspace = async (req: Request, res: Response) => {
  const { workspaceId } = req.params
  const limit = Number(req.query.limit) || 10
  const page = Number(req.query.page) || 1
  const query = req.query.query as string
  const users = await workspaceAdminService.getAllUserInWorkspaceService(workspaceId, limit, page, query)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, users).send(res)
}

const deleteUserInWorkspace = async (req: Request, res: Response) => {
  const { workspaceId, userId } = req.params
  await workspaceAdminService.deleteUserInWorkspaceService(workspaceId, userId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.DELETE_USER_FROM_WORKSPACE_SUCCESS).send(res)
}
export { getAllChannels, updateChannel, deleteChannel, getAllUserInWorkspace, deleteUserInWorkspace }
