import { Router } from 'express'
import { schoolHolidayController } from '../controllers/schoolHoliday.controller'
import { permissionMiddleware } from '../middlewares/auth.middleware'
import { cacheControl } from '../middlewares/cache.middleware'

const router = Router()

router.get('/school-holidays', cacheControl('ONE_MONTH'), schoolHolidayController.getAll)
router.get('/school-holidays/:year', cacheControl('ONE_MONTH'), schoolHolidayController.getFromYear)

router.post('/back-office/school-holidays/import', permissionMiddleware('school-holidays', 'update'), schoolHolidayController.import)

export default router
