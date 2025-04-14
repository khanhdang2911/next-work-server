import Joi from 'joi'
import { GENDER } from '~/constants/common.constant'

const registerValidation = (data: object) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).required(),
    gender: Joi.string()
      .valid(...Object.values(GENDER))
      .required()
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
