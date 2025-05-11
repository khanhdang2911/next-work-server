import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import ERROR_MESSAGES from '~/core/error-message'
import { User } from '~/models/user.model'
import { IInviteUserData, IWorkspace, IWorkspaceMember, Workspace } from '~/models/workspace.model'
import { cleanedMessage, convertToObjectId } from '~/utils/common'
import sendMailInviteTemplate from '~/utils/mail-invite-member.template'
import * as workspaceValidation from '~/validations/workspace.validation'
import transporter from '~/configs/mailer.init'
import { Invitation } from '~/models/invitation.model'
import { Channel } from '~/models/channel.model'
import randtoken from 'rand-token'
import * as workspaceRepo from '~/repositories/workspace.repo'
import dotenv from 'dotenv'
import { deleteUserInWorkspaceService } from './workspace_admin.service'
dotenv.config()

const createWorkspaceService = async (data: IWorkspace, userId: string) => {
  const { error } = workspaceValidation.validateCreateWorkspace(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const checkWorkspaceExisted = await Workspace.exists({
    name: data.name,
    admin: convertToObjectId(userId)
  }).lean()
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
    'members.user': convertToObjectId(userId)
  })
    .select('!members admin name description createdAt')
    .lean()
  return workspaces
}

const inviteUserToWorkspaceService = async (workspaceId: string, userId: string, data: IInviteUserData) => {
  const wId = convertToObjectId(workspaceId)
  const { error } = workspaceValidation.validateInviteUserToWorkspace(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const { email, channels } = data
  const checkInvitationExisted = await Invitation.exists({ email, workspaceId: wId }).lean()
  if (checkInvitationExisted) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.ALREADY_SEND_INVITATION)
  }
  const workspace = await Workspace.findById(wId).select('name').lean()
  if (!workspace) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ERROR_MESSAGES.WORKSPACE_NOT_FOUND)
  }
  const invitedUser = await User.exists({ email }).lean()
  if (!invitedUser) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
  const checkUserAlreadyInWorkspace = await workspaceRepo.checkUserAlreadyInWorkspace(wId, invitedUser._id)
  if (checkUserAlreadyInWorkspace) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_ALREADY_IN_WORKSPACE)
  }
  if (channels && channels.length > 0) {
    const channelsObjectId = channels.map((channelId) => convertToObjectId(channelId))
    const checkChannelsInWorkspace = await workspaceRepo.checkChannelsInWorkspace(wId, channelsObjectId)
    if (!checkChannelsInWorkspace) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CHANNEL_NOT_FOUND)
    }
  }
  const inviter = await User.findById(userId).select('name').lean()
  if (!inviter) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
  const token = randtoken.generate(Number(process.env.OTP_TOKEN_SIZE) || 64)
  const invitationLink = `${process.env.FE_URL_MAIN}/workspace/${workspaceId}/accept-invitation/${token}`
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Invite to join workspace',
    html: sendMailInviteTemplate(email, workspace.name, inviter.name, invitationLink)
  }
  await transporter.sendMail(mailOptions)
  await Invitation.create({
    email,
    workspaceId: wId,
    channels: channels!.map((channelId) => convertToObjectId(channelId)),
    token
  })
}

const acceptInvitationService = async (token: string, workspaceId: string) => {
  const wId = convertToObjectId(workspaceId)
  const invitation = await Invitation.findOne({ token }).select('email channels').lean()
  if (!invitation) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.INVITATION_NOT_FOUND)
  }
  const { email, channels } = invitation
  const user = await User.exists({ email }).lean()
  if (!user) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_FOUND)
  }
  const checkWorkspaceExisted = await Workspace.exists({ _id: wId }).lean()
  if (!checkWorkspaceExisted) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.WORKSPACE_NOT_FOUND)
  }
  const checkChannelsInWorkspace = await workspaceRepo.checkChannelsInWorkspace(wId, channels)
  if (!checkChannelsInWorkspace) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CHANNEL_NOT_FOUND)
  }
  await Workspace.updateOne(
    {
      _id: wId,
      'members.user': { $ne: user._id }
    },
    {
      $addToSet: {
        members: {
          user: user._id,
          joinedAt: new Date()
        }
      }
    }
  )
  await Channel.updateMany(
    {
      _id: { $in: channels },
      workspaceId: wId
    },
    {
      $addToSet: {
        members: {
          user: user._id,
          joinedAt: new Date()
        }
      }
    }
  )
  await Invitation.deleteOne({ token })
}

const getWorkspaceByIdService = async (workspaceId: string, userId: string) => {
  const wId = convertToObjectId(workspaceId)
  const uId = convertToObjectId(userId)
  const checkUserInWorkspace = await workspaceRepo.checkUserAlreadyInWorkspace(wId, uId)
  if (!checkUserInWorkspace) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_WORKSPACE)
  }
  const workspace = await Workspace.findById(wId).select('name description image').lean()
  if (!workspace) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.WORKSPACE_NOT_FOUND)
  }
  return workspace
}

const leaveWorkspaceService = async (workspaceId: string, userId: string) => {
  await deleteUserInWorkspaceService(workspaceId, userId)
}
export {
  createWorkspaceService,
  getAllWorkspaceService,
  inviteUserToWorkspaceService,
  acceptInvitationService,
  getWorkspaceByIdService,
  leaveWorkspaceService
}
