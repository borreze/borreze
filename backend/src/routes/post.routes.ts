import { Router } from 'express'
import { postController } from '../controllers/post.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'
import { cacheControl } from '../middlewares/cache.middleware'

const router = Router()

router.get('/posts/:type/recents', cacheControl('ONE_HOUR'), postController.getRecents)
router.get('/posts/:type/future', postController.getFuture)
router.get('/posts/:type/', postController.getAll)
router.get('/posts/:type/:slug', postController.getBySlug)

router.get('/back-office/posts/:type/', permissionMiddleware('post', 'read'), postController.getAll)
router.get('/back-office/posts/:type/:id', permissionMiddleware('post', 'read'), postController.getById)
router.post('/back-office/posts/:type/', permissionMiddleware('post', 'create'), postController.create)
router.put('/back-office/posts/:type/:id', permissionMiddleware('post', 'update'), postController.update)
router.put('/back-office/posts/:type/:id/status', permissionMiddleware('post', 'update'), postController.updateStatus)
router.put('/back-office/posts/:type/:id/categories', permissionMiddleware('post', 'update'), postController.updateCategories)
router.put('/back-office/posts/:type/:id/medias', permissionMiddleware('post', 'update'), postController.updateMedias)
router.delete('/back-office/posts/:type/:id', permissionMiddleware('post', 'delete'), postController.delete)

export default router
