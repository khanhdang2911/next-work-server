import { Request, Response, NextFunction } from 'express'
import { User } from '~/models/user.model'
import ErrorResponse from '~/core/error.response'
import ERROR_MESSAGES from '~/core/error-message'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { ROLES } from '~/constants/common.constant'
import { convertToObjectId } from '~/utils/common'
import * as channelRepo from '~/repositories/channel.repo'
import * as workspaceRepo from '~/repositories/workspace.repo'
import { Types } from 'mongoose'

const role_permissions = [
  {
    name: ROLES.CHANNEL_ADMIN,
    permissions: ['invite_member_to_channel', 'delete_channel_member']
  },
  {
    name: ROLES.WORKSPACE_ADMIN,
    permissions: [
      'delete_workspace',
      'delete_workspace_member',
      'delete_channel',
      'read_channels',
      'update_channel',
      'invite_member_to_workspace'
    ],
    inherits: [ROLES.CHANNEL_ADMIN]
  },
  {
    name: ROLES.ADMIN,
    permissions: ['crud_workspace', 'crud_user'],
    inherits: [ROLES.CHANNEL_ADMIN, ROLES.WORKSPACE_ADMIN]
  }
]

// get all permissions of a role
const getPermissions = (role: string, result = new Set<string>()) => {
  const roleData = role_permissions.find((r) => r.name === role)
  if (!roleData) return result

  roleData.permissions.forEach((p) => result.add(p))

  const inheritedPermissions = roleData.inherits
  if (inheritedPermissions) {
    inheritedPermissions.forEach((role) => {
      getPermissions(role, result)
    })
  }
  return result
}
const CHANNEL_ADMIN_PERMS = getPermissions(ROLES.CHANNEL_ADMIN)
const WORKSPACE_ADMIN_PERMS = getPermissions(ROLES.WORKSPACE_ADMIN)

const handleChannelAdminPermission = async (action: string, channelId: string, userId: Types.ObjectId) => {
  if (!CHANNEL_ADMIN_PERMS.has(action)) return
  const cId = convertToObjectId(channelId)
  const isChannelAdmin = await channelRepo.checkUserIsAdminOfChannel(cId, userId)
  if (!isChannelAdmin) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN)
  }
}
const handleWorkspaceAdminPermission = async (action: string, workspaceId: string, userId: Types.ObjectId) => {
  if (!WORKSPACE_ADMIN_PERMS.has(action)) return
  const cId = convertToObjectId(workspaceId)
  const isWorkspaceAdmin = await workspaceRepo.checkUserIsAdminOfWorkspace(cId, userId)
  if (!isWorkspaceAdmin) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN)
  }
}

const checkPermission = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = convertToObjectId(req.userId)
      const user = await User.findById(userId).lean()
      if (!user?.roles) {
        throw new ErrorResponse(StatusCodes.UNAUTHORIZED, ERROR_MESSAGES.USER_NOT_FOUND)
      }
      const roles = user.roles
      const allPermissions = new Set<string>()
      roles.forEach((role) => getPermissions(role, allPermissions))
      if (!allPermissions.has(action)) {
        throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN)
      }

      if (CHANNEL_ADMIN_PERMS.has(action)) {
        await handleChannelAdminPermission(action, req.params.channelId, userId)
      }

      if (WORKSPACE_ADMIN_PERMS.has(action)) {
        await handleWorkspaceAdminPermission(action, req.params.workspaceId, userId)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default checkPermission
