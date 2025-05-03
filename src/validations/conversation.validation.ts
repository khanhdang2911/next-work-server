import Joi from 'joi'
import { CONVERSATION_TYPE } from '~/constants/common.constant'

const createConversationValidation = (data: object) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid(...Object.values(CONVERSATION_TYPE))
      .required(),
    channelId: Joi.string().when('type', {
      is: CONVERSATION_TYPE.DIRECT,
      then: Joi.optional(),
      otherwise: Joi.required()
    }),
    workspaceId: Joi.string().when('type', {
      is: CONVERSATION_TYPE.CHANNEL,
      then: Joi.optional(),
      otherwise: Joi.required()
    }),
    participants: Joi.array()
      .optional()
      .items(Joi.string())
      .custom((value, helpers) => {
        if (value.length === 2) {
          return value
        }
        return helpers.error('any.invalid')
      })
  })
  return schema.validate(data)
}
export { createConversationValidation }
