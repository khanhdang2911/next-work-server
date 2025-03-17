import Joi from 'joi'

const createRoleValidation = async (data: object) => {
  const schema = Joi.object({
    role_name: Joi.string().required(),
    role_description: Joi.string().required(),
    role_grants: Joi.array()
      .items(
        Joi.object({
          resource: Joi.string().required(),
          action: Joi.string().required(),
          attributes: Joi.string().required()
        })
      )
      .required()
  })
  return await schema.validateAsync(data)
}

export { createRoleValidation }
