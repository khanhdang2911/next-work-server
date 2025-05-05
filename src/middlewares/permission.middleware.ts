import { Request, Response, NextFunction } from 'express'
import { User } from '~/models/user.model'
import ErrorResponse from '~/core/error.response'
import ERROR_MESSAGES from '~/core/error-message'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { ROLES } from '~/constants/common.constant'

const role_permissions = [
  {
    name: ROLES.CHANNEL_ADMIN,
    permissions: ['invite_member_to_channel', 'delete_channel_member']
  },
  {
    name: ROLES.WORKSPACE_ADMIN,
    permissions: ['delete_workspace', 'delete_workspace_member', 'delete_channel'],
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

const checkPermission = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId)
      if (!user) {
        throw new ErrorResponse(StatusCodes.UNAUTHORIZED, ERROR_MESSAGES.USER_NOT_FOUND)
      }
      const roles = user.roles
      const allPermissions = new Set<string>()
      roles.forEach((role) => getPermissions(role, allPermissions))
      if (!allPermissions.has(action)) {
        throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default checkPermission
