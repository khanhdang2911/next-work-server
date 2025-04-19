import Joi from 'joi'
import { CONVERSATION_TYPE } from '~/constants/common.constant'

const createConversationValidation = (data: object) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid(...Object.values(CONVERSATION_TYPE))
      .required(),
    channelId: Joi.string().optional(),
    participants: Joi.array()
      .optional()
      .items(Joi.string())
      .custom((value, helpers) => {
        if (value.length < 2) {
          return helpers.error('any.invalid')
        }
        return value
      })
  })
  return schema.validate(data)
}
export { createConversationValidation }
