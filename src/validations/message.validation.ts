import Joi from 'joi'
import { isEmoji } from '~/utils/common'

const validateCreateMessage = (data: object) => {
  const schema = Joi.object({
    content: Joi.string(),
    conversationId: Joi.string().required(),
    reactions: Joi.array()
      .items(
        Joi.object({
          emoji: Joi.string().required(),
          count: Joi.number().default(0),
          users: Joi.array().items(Joi.string()).optional()
        })
      )
      .optional()
  })
  return schema.validate(data)
}

const validateUpdateMessage = (data: object) => {
  const schema = Joi.object({
    content: Joi.string()
  })
  return schema.validate(data)
}

const validateReactMessage = (data: object) => {
  const schema = Joi.object({
    emoji: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!isEmoji(value)) {
          return helpers.error('any.invalid')
        }
        return value
      })
  })
  return schema.validate(data)
}
export { validateCreateMessage, validateUpdateMessage, validateReactMessage }
