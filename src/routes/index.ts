import authRouter from './auth.route'
import userRouter from './user.route'
import rbacRouter from './rbac.route'
import mailRouter from './mail.route'
import { Router } from 'express'

const router = Router()
router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/rbac', rbacRouter)
router.use('/mail', mailRouter)
router.use('/', (req, res) => {
  res.send('Hello World!')
})
export default router
