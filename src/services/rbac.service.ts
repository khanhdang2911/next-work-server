import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/error.response'
import ERROR_MESSAGES from '~/core/error-message'
import { IResource, Resource } from '~/models/resource.model'
import { IRole, Role } from '~/models/role.model'
import { createRoleValidation } from '~/validations/rbac.validation'

const createResourceService = async (resource: IResource) => {
  const resourceInDb = await Resource.findOne({ resource_name: resource.resource_name })
  if (resourceInDb) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.RESOURCE_ALREADY_EXIST)
  }
  const newResource = await Resource.create(resource)
  return newResource
}

const createRoleService = async (role: IRole) => {
  const { error } = await createRoleValidation(role)
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message)
  }
  const roleInDb = await Role.findOne({ role_name: role.role_name })
  if (roleInDb) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, ERROR_MESSAGES.ROLE_ALREADY_EXIST)
  }
  const newRole = await Role.create(role)
  return newRole
}

const getResourcesService = async () => {
  const resources = await Resource.find()
  return resources
}

const getRolesService = async () => {
  const roles = await Role.aggregate([
    {
      $unwind: '$role_grants'
    },
    {
      $set: {
        'role_grants.resource': { $toObjectId: '$role_grants.resource' }
      }
    },
    {
      $lookup: {
        from: 'resources',
        localField: 'role_grants.resource',
        foreignField: '_id',
        as: 'resource'
      }
    },
    {
      $unwind: '$resource'
    },
    {
      $project: {
        _id: 0,
        role: '$role_name',
        resource: '$resource.resource_name',
        action: '$role_grants.action',
        attributes: '$role_grants.attributes'
      }
    }
  ])
  return roles
}

export { createResourceService, createRoleService, getResourcesService, getRolesService }
