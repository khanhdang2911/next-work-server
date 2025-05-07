import { Router } from 'express'
import { getAllUsers, lockUser, searchUsers, unlockUser, updateUser } from '~/controllers/admin.controller'
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
export default adminRouter
