import { Router } from 'express'
import * as workspaceController from '~/controllers/workspace.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import checkLockAccount from '~/middlewares/check-lock-account'
import checkPermission from '~/middlewares/permission.middleware'
const workspaceRouter = Router()

workspaceRouter.get('/:workspaceId/accept-invitation/:token', asyncErrorHandler(workspaceController.acceptInvitation))
workspaceRouter.use(asyncErrorHandler(authMiddleware))
workspaceRouter.use(asyncErrorHandler(checkLockAccount))
//Authenticating the user before accessing the route
workspaceRouter.post('/', asyncErrorHandler(workspaceController.createWorkspace))
workspaceRouter.get('/', asyncErrorHandler(workspaceController.getAllWorkspace))
workspaceRouter.get('/:workspaceId', asyncErrorHandler(workspaceController.getWorkspaceById))
workspaceRouter.post(
  '/:workspaceId/invite',
  checkPermission('invite_member_to_workspace'),
  asyncErrorHandler(workspaceController.inviteUserToWorkspace)
)
workspaceRouter.delete('/leave/:workspaceId', asyncErrorHandler(workspaceController.leaveWorkspace))
export default workspaceRouter
