import { Router } from 'express'
import { authController } from '../controllers/auth.controller'

const router = Router()

router.get('/back-office/auth/me', authController.me)
router.post('/back-office/auth/login', authController.login)
router.post('/back-office/auth/refresh', authController.refresh)
router.post('/back-office/auth/logout', authController.logout)
router.post('/back-office/auth/password/send-code', authController.sendResetCode)
router.post('/back-office/auth/password/reset', authController.resetPassword)

export default router
