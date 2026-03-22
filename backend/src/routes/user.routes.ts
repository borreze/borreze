import { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/back-office/users/', permissionMiddleware('user', 'read'), userController.getAll)
router.post('/back-office/users/', permissionMiddleware('user', 'create'), userController.create)
router.get('/back-office/users/:id', permissionMiddleware('user', 'read'), userController.getById)
router.put('/back-office/users/:id', permissionMiddleware('user', 'update'), userController.update)
router.put('/back-office/users/:id/status', permissionMiddleware('user', 'update'), userController.updateStatus)
router.delete('/back-office/users/:id', permissionMiddleware('user', 'delete'), userController.delete)

export default router
