import Joi from 'joi'
import { CONVERSATION_TYPE } from '~/constants/common.constant'

const createConversationValidation = (data: object) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid(...Object.values(CONVERSATION_TYPE))
      .required(),
    channelId: Joi.string().when('type', {
      is: CONVERSATION_TYPE.CHATBOT || CONVERSATION_TYPE.DIRECT,
      then: Joi.optional(),
      otherwise: Joi.required()
    }),
    workspaceId: Joi.string().when('type', {
      is: CONVERSATION_TYPE.CHANNEL,
      then: Joi.optional(),
      otherwise: Joi.required()
    }),
    participants: Joi.array()
      .items(Joi.string())
      .when('type', {
        is: CONVERSATION_TYPE.CHATBOT,
        then: Joi.array().items(Joi.string()).length(1).required(),
        otherwise: Joi.array().items(Joi.string()).length(2).required()
      })
  })
  return schema.validate(data)
}
export { createConversationValidation }
