import Joi from 'joi'
const validateCreateChannel = (data: object) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    description: Joi.string().max(100).optional(),
    isPrivate: Joi.boolean().optional()
  })
  return schema.validate(data)
}
const validateInviteUserToChannel = (data: object) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
  })
  return schema.validate(data)
}
export { validateCreateChannel, validateInviteUserToChannel }
