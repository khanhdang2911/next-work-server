import { Router } from 'express'
import { deleteChannel, getAllChannels, searchChannels, updateChannel } from '~/controllers/workspace_admin.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import checkLockAccount from '~/middlewares/check-lock-account'
import checkPermission from '~/middlewares/permission.middleware'

const workspaceAdminRouter = Router()
workspaceAdminRouter.use(asyncErrorHandler(authMiddleware))
workspaceAdminRouter.use(asyncErrorHandler(checkLockAccount))
//Authenticating the user before accessing the route
workspaceAdminRouter.get(
  '/:workspaceId',
  asyncErrorHandler(checkPermission('read_channels')),
  asyncErrorHandler(getAllChannels)
)
workspaceAdminRouter.patch(
  '/:workspaceId/:channelId',
  asyncErrorHandler(checkPermission('update_channel')),
  asyncErrorHandler(updateChannel)
)
workspaceAdminRouter.delete(
  '/:workspaceId/:channelId',
  asyncErrorHandler(checkPermission('delete_channel')),
  asyncErrorHandler(deleteChannel)
)
workspaceAdminRouter.get(
  '/:workspaceId/:query',
  asyncErrorHandler(checkPermission('read_channels')),
  asyncErrorHandler(searchChannels)
)
export default workspaceAdminRouter
