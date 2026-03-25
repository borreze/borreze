import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import createRateLimiter from '../middlewares/limiter.middleware'
import { softAuthMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/back-office/auth/me', createRateLimiter(2, "ONE_MINUTE"), softAuthMiddleware, authController.me)
router.post('/back-office/auth/login', createRateLimiter(1, "ONE_HOUR"), softAuthMiddleware, authController.login)
router.post('/back-office/auth/refresh', createRateLimiter(2, "ONE_MINUTE"), softAuthMiddleware, authController.refresh)
router.post('/back-office/auth/logout', createRateLimiter(5, "FIFTEEN_MINUTES"), softAuthMiddleware, authController.logout)
// router.post('/back-office/auth/password/send-code', createRateLimiter(2, "ONE_DAY"), softAuthMiddleware,  authController.sendResetCode)
// router.post('/back-office/auth/password/reset', createRateLimiter(2, "ONE_DAY"), softAuthMiddleware,  authController.resetPassword)

export default router
