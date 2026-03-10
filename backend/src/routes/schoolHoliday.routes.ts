import { Router } from 'express'
import { schoolHolidayController } from '../controllers/schoolHoliday.controller'

const router = Router()

router.get('/school-holidays', schoolHolidayController.getAll)
router.get('/school-holidays/:year', schoolHolidayController.getFromYear)

router.get('/back-office/school-holidays/import', schoolHolidayController.import)

export default router
