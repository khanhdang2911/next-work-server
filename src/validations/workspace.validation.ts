import Joi from 'joi'

const validateCreateWorkspace = (data: object) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().optional(),
    image: Joi.string().optional()
  })

  return schema.validate(data)
}

const validateInviteUserToWorkspace = (data: object) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    channels: Joi.array().items(Joi.string()).required()
  })
  return schema.validate(data)
}

export { validateCreateWorkspace, validateInviteUserToWorkspace }
