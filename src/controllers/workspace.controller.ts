import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import SUCCESS_MESSAGES from '~/core/success-message'
import SuccessResponse from '~/core/success.response'
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
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, workspaces).send(res)
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
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK).send(res)
}

const getWorkspaceById = async (req: Request, res: Response) => {
  const userId = req.userId
  const { workspaceId } = req.params
  const workspace = await workspaceService.getWorkspaceByIdService(workspaceId, userId)
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, workspace).send(res)
}

const leaveWorkspace = async (req: Request, res: Response) => {
  const userId = req.userId
  const { workspaceId } = req.params
  await workspaceService.leaveWorkspaceService(workspaceId, userId)
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.LEAVE_WORKSPACE_SUCCESS).send(res)
}
export { createWorkspace, getAllWorkspace, inviteUserToWorkspace, acceptInvitation, getWorkspaceById, leaveWorkspace }
