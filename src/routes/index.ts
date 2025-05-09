import authRouter from './auth.route'
import userRouter from './user.route'
import rbacRouter from './rbac.route'
import mailRouter from './mail.route'
import workspaceRouter from './workspace.route'
import channelRouter from './channel.route'
import conversationRouter from './conversation.route'
import adminRouter from './admin.route'
import { Router } from 'express'
import messageRouter from './message.route'
import workspaceAdminRouter from './workspace_admin.route'

const router = Router()
router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/rbac', rbacRouter)
router.use('/mail', mailRouter)
router.use('/workspaces', workspaceRouter)
router.use('/channels', channelRouter)
router.use('/messages', messageRouter)
router.use('/conversations', conversationRouter)
router.use('/admin', adminRouter)
router.use('/workspace/admin', workspaceAdminRouter)
router.use('/', (req, res) => {
  res.send('Hello World!')
})
export default router
