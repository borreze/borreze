import { Router } from 'express'
import { mediaController } from '../controllers/media.controller'
import { upload } from '../middlewares/upload.middleware'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/back-office/medias/', permissionMiddleware('post', 'read'), mediaController.getAll)
router.get('/back-office/medias/:id', permissionMiddleware('post', 'read'), mediaController.getById)
router.post('/back-office/medias/', permissionMiddleware('post', 'create'), upload.single('file'), mediaController.upload)
router.post('/back-office/medias/multiple', permissionMiddleware('post', 'create'), upload.array('files', 10), mediaController.uploadMultiple)
router.put('/back-office/medias/:id', permissionMiddleware('post', 'update'), mediaController.update)
router.delete('/back-office/medias/:id', permissionMiddleware('post', 'delete'), mediaController.delete)
router.delete('/back-office/medias/', permissionMiddleware('post', 'delete'), mediaController.deleteMultiple)

export default router