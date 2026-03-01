import { Router } from 'express'
import { authController } from '../controllers/auth.controller'

// ! NB : all routes are POST to avoid putting sensitive info in URL (GET query)

const router = Router()

router.post('/admin/auth/login', authController.login)
router.post('/admin/auth/refresh', authController.refresh)
router.post('/admin/auth/logout', authController.logout)
router.post('/admin/auth/password/send-code', authController.sendResetCode)
router.post('/admin/auth/password/reset', authController.resetPassword)

export default router
