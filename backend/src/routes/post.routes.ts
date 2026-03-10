import { Router } from 'express'
import { postController } from '../controllers/post.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/posts/recents', postController.getRecents)
router.get('/posts/', postController.getAll)
router.get('/posts/:slug', postController.getBySlug)

router.get('/back-office/posts/', permissionMiddleware('post', 'read'), postController.getAll)
router.get('/back-office/posts/:id', permissionMiddleware('post', 'read'), postController.getById)
router.post('/back-office/posts/', permissionMiddleware('post', 'create'), postController.create)
router.put('/back-office/posts/:id', permissionMiddleware('post', 'update'), postController.update)
router.put('/back-office/posts/:id/status', permissionMiddleware('post', 'update'), postController.updateStatus)
router.delete('/back-office/posts/:id', permissionMiddleware('post', 'delete'), postController.delete)

export default router
