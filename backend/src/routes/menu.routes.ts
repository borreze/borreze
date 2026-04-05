import { Router } from 'express'
import { menuController } from '../controllers/menu.controller'
import { permissionMiddleware, softAuthMiddleware } from '../middlewares/auth.middleware'
import { cacheControl } from '../middlewares/cache.middleware'

const router = Router()

router.get('/menus/:scope', softAuthMiddleware, cacheControl('ONE_DAY'), menuController.getAllByScope)

router.get('/back-office/menus/', permissionMiddleware('menu', 'read'), menuController.getAll)
router.get('/back-office/menus/:id', permissionMiddleware('menu', 'read'), menuController.getById)
router.post('/back-office/menus/', permissionMiddleware('menu', 'create'), menuController.create)
router.put('/back-office/menus/:id', permissionMiddleware('menu', 'update'), menuController.update)
router.delete('/back-office/menus/:id', permissionMiddleware('menu', 'delete'), menuController.delete)

export default router
