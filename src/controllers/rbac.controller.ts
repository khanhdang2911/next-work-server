import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import SuccessResponse from '~/core/success.response'
import { createResourceService, createRoleService, getResourcesService, getRolesService } from '~/services/rbac.service'
const createResource = async (req: Request, res: Response) => {
  const resource = req.body
  const newResource = await createResourceService(resource)
  new SuccessResponse(StatusCodes.CREATED, 'Resource created', newResource).send(res)
}

const createRole = async (req: Request, res: Response) => {
  const role = req.body
  const newRole = await createRoleService(role)
  new SuccessResponse(StatusCodes.CREATED, 'Role created', newRole).send(res)
}

const getResources = async (req: Request, res: Response) => {
  const resources = await getResourcesService()
  new SuccessResponse(StatusCodes.OK, 'Resources retrieved', resources).send(res)
}

const getRoles = async (req: Request, res: Response) => {
  const roles = await getRolesService()
  new SuccessResponse(StatusCodes.OK, 'Roles retrieved', roles).send(res)
}
export { createResource, createRole, getResources, getRoles }
