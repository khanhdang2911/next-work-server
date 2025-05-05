import { Router } from 'express'
import { getAllUsers } from '~/controllers/user.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import checkPermission from '~/middlewares/permission.middleware'

const adminRouter = Router()
adminRouter.use(asyncErrorHandler(authMiddleware))
//Authenticating the user before accessing the route
adminRouter.get('/users', checkPermission('crud_user'), asyncErrorHandler(getAllUsers))
export default adminRouter
