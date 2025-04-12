import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/core/success.response'
import SUCCESS_MESSAGES from '~/core/success-message'
import { createResourceService, createRoleService, getResourcesService, getRolesService } from '~/services/rbac.service'
const createResource = async (req: Request, res: Response) => {
  const resource = req.body
  const newResource = await createResourceService(resource)
  new SuccessResponse(StatusCodes.CREATED, SUCCESS_MESSAGES.RESOURCE_CREATED, newResource).send(res)
}

const createRole = async (req: Request, res: Response) => {
  const role = req.body
  const newRole = await createRoleService(role)
  new SuccessResponse(StatusCodes.CREATED, SUCCESS_MESSAGES.ROLE_CREATED, newRole).send(res)
}

const getResources = async (req: Request, res: Response) => {
  const resources = await getResourcesService()
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.RESOURCE_RETRIEVED, resources).send(res)
}

const getRoles = async (req: Request, res: Response) => {
  const roles = await getRolesService()
  new SuccessResponse(StatusCodes.OK, SUCCESS_MESSAGES.ROLE_RETRIEVED, roles).send(res)
}
export { createResource, createRole, getResources, getRoles }
