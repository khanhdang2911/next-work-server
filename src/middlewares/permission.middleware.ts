import { Request, Response, NextFunction } from 'express'
import { AccessControl } from 'accesscontrol'
import { User } from '~/models/user.model'
import ErrorResponse from '~/core/error.response'
import ERROR_MESSAGES from '~/core/error-message'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { getRolesService } from '~/services/rbac.service'

let ac: AccessControl
const initializeAccessControl = async () => {
  const grantList = await getRolesService()
  ac = new AccessControl(grantList)
}
initializeAccessControl()

const checkPermission = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId)
      if (!user) {
        throw new ErrorResponse(StatusCodes.UNAUTHORIZED, ERROR_MESSAGES.USER_NOT_FOUND)
      }
      const role = user.role
      const permission = ac.can(role)[action](resource)
      if (!permission.granted) {
        throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default checkPermission
