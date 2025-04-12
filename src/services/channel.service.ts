import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import ERROR_MESSAGES from '~/core/error-message'
import { Channel, IChannel, IChannelMember } from '~/models/channel.model'
import { Workspace } from '~/models/workspace.model'
import { cleanedMessage, convertToObjectId } from '~/utils/common'
import * as channelValidation from '~/validations/channel.validation'
const createChannelService = async (userId: string, workspaceId: string, data: IChannel) => {
  const { error } = channelValidation.validateCreateChannel(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const wsId = convertToObjectId(workspaceId)
  const uId = convertToObjectId(userId)
  const checkUserInWorkspace = await Workspace.exists({
    _id: wsId,
    members: {
      $elemMatch: {
        user: uId
      }
    }
  })
  if (!checkUserInWorkspace) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_IN_WORKSPACE)
  }
  const checkIsExistChannel = await Channel.exists({
    name: data.name,
    workspaceId: wsId
  })
  if (checkIsExistChannel) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.CHANNEL_EXISTED)
  }
  const firstMember: IChannelMember = {
    user: uId,
    joinedAt: new Date()
  }
  const channel = await Channel.create({
    ...data,
    workspaceId,
    members: [firstMember],
    admin: [uId]
  })
  return channel
}

export { createChannelService }
