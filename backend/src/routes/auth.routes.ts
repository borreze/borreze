import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import createRateLimiter from '../middlewares/limiter.middleware'

const router = Router()

router.get('/back-office/auth/me', createRateLimiter(5, "ONE_MINUTE"), authController.me)
router.post('/back-office/auth/login', createRateLimiter(1, "ONE_MINUTE"), authController.login)
router.post('/back-office/auth/refresh', createRateLimiter(5, "ONE_MINUTE"), authController.refresh)
router.post('/back-office/auth/logout', createRateLimiter(5, "FIFTEEN_MINUTES"), authController.logout)
router.post('/back-office/auth/password/send-code', createRateLimiter(2, "ONE_DAY"), authController.sendResetCode)
router.post('/back-office/auth/password/reset', createRateLimiter(2, "ONE_DAY"), authController.resetPassword)

export default router
