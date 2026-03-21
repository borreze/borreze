import { Router } from 'express'
import { mediaController } from '../controllers/media.controller'
import { upload } from '../middlewares/upload.middleware'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/back-office/medias/', permissionMiddleware('media', 'read'), mediaController.getAll)
router.get('/back-office/medias/:id', permissionMiddleware('media', 'read'), mediaController.getById)
router.post('/back-office/medias/', permissionMiddleware('media', 'create'), upload.single('file'), mediaController.upload)
router.post('/back-office/medias/multiple', permissionMiddleware('media', 'create'), upload.array('files', 10), mediaController.uploadMultiple)
router.put('/back-office/medias/:id', permissionMiddleware('media', 'update'), mediaController.update)
router.delete('/back-office/medias/:id', permissionMiddleware('media', 'delete'), mediaController.delete)
router.delete('/back-office/medias/', permissionMiddleware('media', 'delete'), mediaController.deleteMultiple)

export default router