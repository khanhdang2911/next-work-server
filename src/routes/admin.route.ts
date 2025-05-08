import { Router } from 'express'
import {
  deleteWorkspace,
  getAllUsers,
  getAllWorkspaces,
  lockUser,
  searchUsers,
  searchWorkspaces,
  unlockUser,
  updateUser
} from '~/controllers/admin.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import checkLockAccount from '~/middlewares/check-lock-account'
import checkPermission from '~/middlewares/permission.middleware'

const adminRouter = Router()
adminRouter.use(asyncErrorHandler(authMiddleware))
adminRouter.use(asyncErrorHandler(checkLockAccount))
adminRouter.use(asyncErrorHandler(checkPermission('crud_user')))
//Authenticating the user before accessing the route
adminRouter.get('/users', asyncErrorHandler(getAllUsers))
adminRouter.put('/users/lock/:lock_userId', asyncErrorHandler(lockUser))
adminRouter.put('/users/unlock/:unlock_userId', asyncErrorHandler(unlockUser))
adminRouter.patch('/users/:update_userId', asyncErrorHandler(updateUser))
adminRouter.get('/users/search/:query', asyncErrorHandler(searchUsers))
// workspaces
adminRouter.get('/workspaces', asyncErrorHandler(getAllWorkspaces))
adminRouter.delete('/workspaces/:workspaceId', asyncErrorHandler(deleteWorkspace))
adminRouter.get('/workspaces/search/:query', asyncErrorHandler(searchWorkspaces))
adminRouter.get('/workspaces/search/:query', asyncErrorHandler(searchWorkspaces))
export default adminRouter
