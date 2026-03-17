import { Router } from 'express'
import { scheduleController } from '../controllers/schedule.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/schedules/:type', scheduleController.getByType)

router.get('/back-office/schedules/', permissionMiddleware('schedule', 'read'), scheduleController.getAll)
router.get('/back-office/schedules/:id', permissionMiddleware('schedule', 'read'), scheduleController.getById)
router.post('/back-office/schedules/', permissionMiddleware('schedule', 'create'), scheduleController.create)
router.put('/back-office/schedules/:id', permissionMiddleware('schedule', 'update'), scheduleController.update)
router.delete('/back-office/schedules/:id', permissionMiddleware('schedule', 'delete'), scheduleController.delete)

export default router
