import { Router } from 'express'

const channelRouter = Router()
import * as channelController from '~/controllers/channel.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'
import authMiddleware from '~/middlewares/auth.middleware'
import checkLockAccount from '~/middlewares/check-lock-account'
import checkPermission from '~/middlewares/permission.middleware'
channelRouter.use(asyncErrorHandler(authMiddleware))
channelRouter.use(asyncErrorHandler(checkLockAccount))
// create channel
channelRouter.post('/:workspaceId', asyncErrorHandler(channelController.createChannel))
channelRouter.post(
  '/:workspaceId/:channelId/invite',
  checkPermission('invite_member_to_channel'),
  asyncErrorHandler(channelController.inviteUserToChannel)
)
channelRouter.get('/:workspaceId', asyncErrorHandler(channelController.getChannels))
channelRouter.get('/:channelId/members', asyncErrorHandler(channelController.getChannelMembers))
// delete member from channel
channelRouter.delete(
  '/:channelId/members/:memberId',
  checkPermission('delete_channel_member'),
  asyncErrorHandler(channelController.deleteMemberFromChannel)
)
channelRouter.delete('/leave/:channelId', asyncErrorHandler(channelController.leaveChannel))
channelRouter.patch(
  '/:channelId/members/role',
  checkPermission('update_channel_role_member'),
  asyncErrorHandler(channelController.updateRoleOfMemberInChannel)
)
export default channelRouter
