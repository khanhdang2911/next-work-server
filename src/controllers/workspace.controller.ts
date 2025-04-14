import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/core/success.response'
import SUCCESS_MESSAGES from '~/core/success-message'
import * as workspaceService from '~/services/workspace.service'
const createWorkspace = async (req: Request, res: Response) => {
  const userId = req.userId
  const data = req.body
  const workspace = await workspaceService.createWorkspaceService(data, userId)
  new SuccessResponse(StatusCodes.CREATED, SUCCESS_MESSAGES.CREATE_WORKSPACE_SUCCESS, workspace).send(res)
}

const getAllWorkspace = async (req: Request, res: Response) => {
  const userId = req.userId
  const workspaces = await workspaceService.getAllWorkspaceService(userId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.GET_ALL_WORKSPACE_SUCCESS, workspaces).send(res)
}
const inviteUserToWorkspace = async (req: Request, res: Response) => {
  const userId = req.userId
  const { workspaceId } = req.params
  const data = req.body
  await workspaceService.inviteUserToWorkspaceService(workspaceId, userId, data)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.INVITE_USER_TO_WORKSPACE_SUCCESS).send(res)
}
const acceptInvitation = async (req: Request, res: Response) => {
  const token = req.params.token
  const { workspaceId } = req.params
  await workspaceService.acceptInvitationService(token, workspaceId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.ACCEPT_INVITATION_SUCCESS).send(res)
}
export { createWorkspace, getAllWorkspace, inviteUserToWorkspace, acceptInvitation }
