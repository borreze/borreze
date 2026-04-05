import { Router } from 'express'
import { popupController } from '../controllers/popup.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'
import { cacheControl } from '../middlewares/cache.middleware'

const router = Router()

router.get('/popups/', cacheControl('ONE_HOUR'), popupController.getAll)

router.get('/back-office/popups/', permissionMiddleware('popup', 'read'), popupController.getAll)
router.get('/back-office/popups/:id', permissionMiddleware('popup', 'read'), popupController.getById)
router.post('/back-office/popups/', permissionMiddleware('popup', 'create'), popupController.create)
router.put('/back-office/popups/:id', permissionMiddleware('popup', 'update'), popupController.update)
router.delete('/back-office/popups/:id', permissionMiddleware('popup', 'delete'), popupController.delete)

export default router
