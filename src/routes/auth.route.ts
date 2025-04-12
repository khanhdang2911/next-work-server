import { Router } from 'express'
import { generateRefreshToken, Login, LoginWithAuth0, Logout, Register } from '~/controllers/auth.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import auth0Middleware from '~/middlewares/auth0.middleware'
import authV2Middleware from '~/middlewares/auth-v2.middleware'

const authRouter = Router()

authRouter.post('/login', asyncErrorHandler(Login))
authRouter.post('/register', asyncErrorHandler(Register))
authRouter.get('/logout', asyncErrorHandler(authMiddleware), asyncErrorHandler(Logout))
authRouter.post('/refresh-token', asyncErrorHandler(authV2Middleware), asyncErrorHandler(generateRefreshToken))
authRouter.post('/login-auth0', auth0Middleware, asyncErrorHandler(LoginWithAuth0))
export default authRouter
