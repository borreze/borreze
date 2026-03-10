import { Router } from 'express'
import { categoryController } from '../controllers/category.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/categories/', categoryController.getAll)
router.get('/categories/:type/', categoryController.getAllByType)

router.get('/back-office/categories/', permissionMiddleware('category', 'read'), categoryController.getAll)
router.get('/back-office/categories/:id', permissionMiddleware('category', 'read'), categoryController.getById)
router.post('/back-office/categories/', permissionMiddleware('category', 'create'), categoryController.create)
router.put('/back-office/categories/:id', permissionMiddleware('category', 'update'), categoryController.update)
router.delete('/back-office/categories/:id', permissionMiddleware('category', 'delete'), categoryController.delete)

export default router
