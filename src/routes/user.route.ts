import { Router } from 'express'
import { getUserById, searchUser, updateUserById } from '~/controllers/user.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import checkLockAccount from '~/middlewares/check-lock-account'
import { handleUploadSingleFile } from '~/middlewares/handle-upload'

const userRouter = Router()
userRouter.use(asyncErrorHandler(authMiddleware))
userRouter.use(asyncErrorHandler(checkLockAccount))

//Authenticating the user before accessing the route
userRouter.get('/search/:keyword/:channelId', asyncErrorHandler(searchUser))
userRouter.get('/:id', asyncErrorHandler(getUserById))
// update user by id
userRouter.patch('/', handleUploadSingleFile, asyncErrorHandler(updateUserById))
export default userRouter
