import { Router } from 'express'

const channelRouter = Router()
import * as channelController from '~/controllers/channel.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
channelRouter.use(asyncErrorHandler(authMiddleware))

// create channel
channelRouter.post('/:workspaceId', asyncErrorHandler(channelController.createChannel))
channelRouter.post('/:workspaceId/:channelId/invite', asyncErrorHandler(channelController.inviteUserToChannel))
channelRouter.get('/:workspaceId', asyncErrorHandler(channelController.getChannels))
channelRouter.get('/:channelId/members', asyncErrorHandler(channelController.getChannelMembers))
export default channelRouter
