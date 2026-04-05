import { Router } from 'express'
import { homeQuickController } from '../controllers/homeQuick.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'
import { cacheControl } from '../middlewares/cache.middleware'

const router = Router()

router.get('/home-quicks/', cacheControl('TWO_DAYS'), homeQuickController.getAll)

router.get('/back-office/home-quicks/', permissionMiddleware('home-quick', 'read'), homeQuickController.getAll)
router.get('/back-office/home-quicks/:id', permissionMiddleware('home-quick', 'read'), homeQuickController.getById)
router.post('/back-office/home-quicks/', permissionMiddleware('home-quick', 'create'), homeQuickController.create)
router.put('/back-office/home-quicks/:id', permissionMiddleware('home-quick', 'update'), homeQuickController.update)
router.delete('/back-office/home-quicks/:id', permissionMiddleware('home-quick', 'delete'), homeQuickController.delete)

export default router
