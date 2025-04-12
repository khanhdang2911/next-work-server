import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import ERROR_MESSAGES from '~/core/error-message'
import { User } from '~/models/user.model'
import { IWorkspace, IWorkspaceMember, Workspace } from '~/models/workspace.model'
import { cleanedMessage, convertToObjectId } from '~/utils/common'
import sendMailInviteTemplate from '~/utils/mail-invite-member.template'
import * as workspaceValidation from '~/validations/workspace.validation'
const createWorkspaceService = async (data: IWorkspace, userId: string) => {
  const { error } = workspaceValidation.validateCreateWorkspace(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const checkWorkspaceExisted = await Workspace.findOne({
    name: data.name,
    admin: convertToObjectId(userId)
  })
  if (checkWorkspaceExisted) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.WORKSPACE_EXISTED)
  }
  const firstMember: IWorkspaceMember = {
    user: convertToObjectId(userId),
    joinedAt: new Date()
  }
  const workspace = await Workspace.create({
    ...data,
    admin: userId,
    members: [firstMember]
  })
  return workspace
}

const getAllWorkspaceService = async (userId: string) => {
  const workspaces = await Workspace.find({
    members: {
      $elemMatch: {
        user: convertToObjectId(userId)
      }
    }
  }).lean()
  return workspaces
}

const inviteUserToWorkspaceService = async (workspaceId: string, userId: string, email: string) => {
  // const user = User.findById(userId)
  // const workspace = Workspace.findById(workspaceId)
  // const mailOptions = {
  //   from: process.env.MAIL_FROM,
  //   to: email,
  //   subject: 'Invite to join workspace',
  //   html: sendMailInviteTemplate(email, workspace.,)
  // }

}
export { createWorkspaceService, getAllWorkspaceService, inviteUserToWorkspaceService }
