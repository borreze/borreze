import { Router } from 'express'
import { homeQuickController } from '../controllers/homeQuick.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/home-quicks/', homeQuickController.getAll)

router.get('/back-office/home-quicks/', permissionMiddleware('post', 'read'), homeQuickController.getAll)
router.get('/back-office/home-quicks/:id', permissionMiddleware('post', 'read'), homeQuickController.getById)
router.post('/back-office/home-quicks/', permissionMiddleware('post', 'create'), homeQuickController.create)
router.put('/back-office/home-quicks/:id', permissionMiddleware('post', 'update'), homeQuickController.update)
router.delete('/back-office/home-quicks/:id', permissionMiddleware('post', 'delete'), homeQuickController.delete)

export default router
