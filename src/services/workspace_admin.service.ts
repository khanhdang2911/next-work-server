import { StatusCodes } from 'http-status-codes'
import ERROR_MESSAGES from '~/core/error-message'
import ErrorResponse from '~/core/error.response'
import { ChannelUpdateDTO } from '~/dtos/channel.dto'
import { Channel } from '~/models/channel.model'
import { Conversation } from '~/models/conversation.model'
import { Message } from '~/models/message.model'
import { cleanedMessage, convertToObjectId } from '~/utils/common'
import { validateCreateChannel } from '~/validations/channel.validation'

const getAllChannelsService = async (workspaceId: string, limit: number, page: number) => {
  const skip = (page - 1) * limit
  const wId = convertToObjectId(workspaceId)
  const channels = await Channel.aggregate([
    {
      $match: {
        workspaceId: wId
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin'
      }
    },
    {
      $unwind: '$admin'
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    },
    {
      $project: {
        name: 1,
        description: 1,
        isActive: 1,
        workspaceId: 1,
        members: { $size: '$members' },
        admin: {
          email: '$admin.email',
          name: '$admin.name'
        },
        createdAt: 1
      }
    }
  ])
  const totalDocs = await Channel.countDocuments({ workspaceId: wId })
  const totalPages = Math.ceil(totalDocs / limit)

  return {
    channels,
    currentPage: page,
    totalPages: totalPages
  }
}

const updateChannelService = async (workspaceId: string, channelId: string, data: ChannelUpdateDTO) => {
  const { error } = validateCreateChannel(data)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, cleanedMessage(error.message))
  }
  const wId = convertToObjectId(workspaceId)
  const cId = convertToObjectId(channelId)
  const checkNameChannelAlreadyExist = await Channel.exists({
    _id: { $ne: cId },
    name: data.name,
    workspaceId: wId
  }).lean()
  if (checkNameChannelAlreadyExist) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.NAME_CHANNEL_EXISTED)
  }
  const channel = await Channel.findOneAndUpdate({ _id: cId, workspaceId: wId }, { $set: data }, { new: true })
    .select('name description')
    .lean()

  if (!channel) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, ERROR_MESSAGES.UPDATE_CHANNEL_FAILED)
  }
  return channel
}

const deleteChannelService = async (workspaceId: string, channelId: string) => {
  const wId = convertToObjectId(workspaceId)
  const cId = convertToObjectId(channelId)
  const session = await Channel.startSession()
  try {
    await session.withTransaction(async () => {
      await Channel.deleteOne({ _id: cId, workspaceId: wId }).session(session)
      const conversationId = await Conversation.findOne({ channelId: cId }).select('_id').lean()
      await Message.deleteMany({ conversationId: conversationId!._id }).session(session)
      await Conversation.deleteOne({ _id: conversationId!._id }).session(session)
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.DELETE_CHANNEL_FAILED)
  } finally {
    session.endSession()
  }
}

const searchChannelsService = async (workspaceId: string, query: string, limit: number, page: number) => {
  console.log('query', query)
  const skip = (page - 1) * limit
  const wId = convertToObjectId(workspaceId)
  const regex = new RegExp(query, 'i')
  const channels = await Channel.aggregate([
    {
      $match: {
        workspaceId: wId,
        name: regex
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'admin',
        foreignField: '_id',
        as: 'admin'
      }
    },
    {
      $unwind: '$admin'
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    },
    {
      $project: {
        name: 1,
        description: 1,
        isActive: 1,
        workspaceId: 1,
        members: { $size: '$members' },
        admin: {
          email: '$admin.email',
          name: '$admin.name'
        },
        createdAt: 1
      }
    }
  ])
  const totalDocs = await Channel.countDocuments({ workspaceId: wId, name: regex })
  const totalPages = Math.ceil(totalDocs / limit)
  return {
    channels,
    currentPage: page,
    totalPages: totalPages
  }
}
export { getAllChannelsService, updateChannelService, deleteChannelService, searchChannelsService }
