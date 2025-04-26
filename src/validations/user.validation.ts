import Joi from 'joi'
import { GENDER, USER_STATUS } from '~/constants/common.constant'
const validateUpdateUser = (data: object) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).optional(),
    gender: Joi.string()
      .valid(...Object.values(GENDER))
      .optional(),
    status: Joi.string()
      .valid(...Object.values(USER_STATUS))
      .optional()
  })
  return schema.validate(data)
}
export { validateUpdateUser }
