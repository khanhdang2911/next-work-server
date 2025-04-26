import { Router } from 'express'
import { getAllUsers, getUserById, searchUser, updateUserById } from '~/controllers/user.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import { handleUploadSingleFile } from '~/middlewares/handle-upload'
import checkPermission from '~/middlewares/permission.middleware'

const userRouter = Router()
userRouter.use(asyncErrorHandler(authMiddleware))
//Authenticating the user before accessing the route
userRouter.get('/', checkPermission('readAny', 'user'), asyncErrorHandler(getAllUsers))
userRouter.get('/search/:keyword', checkPermission('readOwn', 'user'), asyncErrorHandler(searchUser))
userRouter.get('/:id', asyncErrorHandler(getUserById))
// update user by id
userRouter.patch('/', handleUploadSingleFile, asyncErrorHandler(updateUserById))
export default userRouter
