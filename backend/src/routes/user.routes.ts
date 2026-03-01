import { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/admin/users/', permissionMiddleware('user', 'read'), userController.getAll)
router.post('/admin/users/', permissionMiddleware('user', 'create'), userController.create)
router.get('/admin/users/:id', permissionMiddleware('user', 'read'), userController.getById)
router.put('/admin/users/:id', permissionMiddleware('user', 'update'), userController.update)
router.delete('/admin/users/:id', permissionMiddleware('user', 'delete'), userController.delete)

export default router
