import { Router } from 'express'
import { roleController } from '../controllers/role.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/back-office/roles/', permissionMiddleware('role', 'read'), roleController.getAll)
router.get('/back-office/roles/:id', permissionMiddleware('role', 'read'), roleController.getById)
router.post('/back-office/roles/', permissionMiddleware('role', 'create'), roleController.create)
router.put('/back-office/roles/:id', permissionMiddleware('role', 'update'), roleController.update)
router.delete('/back-office/roles/:id', permissionMiddleware('role', 'delete'), roleController.delete)

export default router
