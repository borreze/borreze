import { Router } from 'express'
import { logController } from '../controllers/log.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/admin/logs/', logController.getAll)
router.get('/admin/logs/clear', permissionMiddleware('log', 'delete'), logController.clear)
router.get('/admin/logs/:id', permissionMiddleware('log', 'read'), logController.getById)

export default router
