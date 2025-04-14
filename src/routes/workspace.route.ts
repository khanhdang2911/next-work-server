import { Router } from 'express'
import * as workspaceController from '~/controllers/workspace.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
const workspaceRouter = Router()

workspaceRouter.get('/:workspaceId/accept-invitation/:token', asyncErrorHandler(workspaceController.acceptInvitation))
workspaceRouter.use(asyncErrorHandler(authMiddleware))
//Authenticating the user before accessing the route
workspaceRouter.post('/', asyncErrorHandler(workspaceController.createWorkspace))
workspaceRouter.get('/', asyncErrorHandler(workspaceController.getAllWorkspace))
// workspaceRouter.put('/:workspaceId', asyncErrorHandler(updateWorkspace))
// workspaceRouter.delete('/:workspaceId', asyncErrorHandler(deleteWorkspace))
workspaceRouter.post('/:workspaceId/invite', asyncErrorHandler(workspaceController.inviteUserToWorkspace))
export default workspaceRouter
