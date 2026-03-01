import { Router } from 'express'
import { globalController } from '../controllers/global.controller'

const router = Router()

router.get('/global/search', globalController.search)

export default router
