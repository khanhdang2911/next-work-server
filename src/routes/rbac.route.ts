import { Router } from 'express'
import { createResource, createRole, getResources, getRoles } from '~/controllers/rbac.controller'
import asyncErrorHandler from '~/helpers/async-error-handler'

const rbacRouter = Router()
rbacRouter.post('/resource', asyncErrorHandler(createResource))
rbacRouter.post('/role', asyncErrorHandler(createRole))
rbacRouter.get('/resources', asyncErrorHandler(getResources))
rbacRouter.get('/roles', asyncErrorHandler(getRoles))
export default rbacRouter
