import Joi from 'joi'

const registerValidation = async (data: object) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).required(),
    lastname: Joi.string().min(2).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    gender: Joi.string().valid('Male', 'Female').required()
  })
  return await schema.validateAsync(data)
}
const loginValidation = async (data: object) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  })
  return await schema.validateAsync(data)
}
export { registerValidation, loginValidation }
