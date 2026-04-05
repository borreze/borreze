import { Router } from 'express'
import { globalController } from '../controllers/global.controller'
import { cacheControl } from '../middlewares/cache.middleware'

const router = Router()

router.get('/global/search', cacheControl('ONE_HOUR'), globalController.search)

export default router
