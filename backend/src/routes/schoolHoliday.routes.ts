import { Router } from 'express'
import { schoolHolidayController } from '../controllers/schoolHoliday.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/school-holidays', schoolHolidayController.getAll)
router.get('/school-holidays/:year', schoolHolidayController.getFromYear)

router.post('/back-office/school-holidays/import', permissionMiddleware('school-holidays', 'update'), schoolHolidayController.import)

export default router
