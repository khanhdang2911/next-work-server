import Joi from 'joi'

const registerValidation = (data: object) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).required(),
    lastname: Joi.string().min(2).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    gender: Joi.string().valid('Male', 'Female').required()
  })
  return schema.validate(data)
}
const loginValidation = (data: object) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(data)
}
export { registerValidation, loginValidation }
