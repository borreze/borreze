import { Router } from 'express'
import { authController } from '../controllers/auth.controller'

const router = Router()

router.get('/admin/auth/me', authController.me)
router.post('/admin/auth/login', authController.login)
router.post('/admin/auth/refresh', authController.refresh)
router.post('/admin/auth/logout', authController.logout)
router.post('/admin/auth/password/send-code', authController.sendResetCode)
router.post('/admin/auth/password/reset', authController.resetPassword)

export default router
