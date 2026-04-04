import { Router } from 'express'
import { galleryController } from '../controllers/gallery.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/back-office/galleries/', permissionMiddleware('gallery', 'read'), galleryController.getAll)
router.get('/back-office/galleries/:id', permissionMiddleware('gallery', 'read'), galleryController.getById)
router.post('/back-office/galleries/', permissionMiddleware('gallery', 'create'), galleryController.create)
router.put('/back-office/galleries/:id', permissionMiddleware('gallery', 'update'), galleryController.update)
router.put('/back-office/galleries/:id/photos', permissionMiddleware('gallery', 'update'), galleryController.updatePhotos)
router.delete('/back-office/galleries/:id', permissionMiddleware('gallery', 'delete'), galleryController.delete)

export default router
