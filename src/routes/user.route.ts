import { Router } from 'express'
import { getAllUsers, searchUser } from '~/controllers/user.controller'
import asyncErrorHandler from '~/helpers/asyncErrorHandler'
import authMiddleware from '~/middlewares/auth.middleware'
import checkPermission from '~/middlewares/permission.middleware'

const userRouter = Router()
userRouter.use(asyncErrorHandler(authMiddleware))
//Authenticating the user before accessing the route
userRouter.get('/', checkPermission('readAny', 'user'), asyncErrorHandler(getAllUsers))
userRouter.get('/search/:keyword', checkPermission('readOwn', 'user'), asyncErrorHandler(searchUser))
export default userRouter
