import { Router } from 'express'
import { contactController } from '../controllers/contact.controller'
import createRateLimiter from '../middlewares/limiter.middleware'

const router = Router()

router.post('/contact', createRateLimiter(2, "ONE_DAY"), contactController.send)

export default router
