import Joi from 'joi'

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

export { validateCreateMessage }
