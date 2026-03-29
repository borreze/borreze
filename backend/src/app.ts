import express, { Express, Request, Response } from 'express'
import { Return } from './types/utils/api.types'
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger.json"
import postRoutes from './routes/post.routes'
import roleRoutes from './routes/role.routes'
import scheduleRoutes from './routes/schedule.routes'
import categoryRoutes from './routes/category.routes'
import homeQuickRoutes from './routes/homeQuick.routes'
import userRoutes from './routes/user.routes'
import popupRoutes from './routes/popup.routes'
import menuRoutes from './routes/menu.routes'
import contactRoutes from './routes/contact.routes'
import mediaRoutes from './routes/media.routes'
import logRoutes from './routes/log.routes'
import schoolHolidayRoutes from './routes/schoolHoliday.routes'
import authRoutes from './routes/auth.routes'
import globalRoutes from './routes/global.routes'
import { NotFound } from './exceptions/request.exception'
import { NextFunction } from 'express-serve-static-core'
import { errorMiddleware } from './middlewares/error.middleware'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { Terminal } from './utils/terminal.utils'
import { initSchoolHolidayCron } from './crons/schoolHoliday.cron'
import { multerErrorHandler } from './middlewares/multer.middleware'
import { MEDIA_UPLOAD_DIR, MEDIA_UPLOAD_URL } from '@brz/shared'
import { initPostCron } from './crons/post.cron'
import { config } from './config/config'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app: Express = express()

// Parse JSON bodies (as sent by API clients)
app.use(express.json({ limit: '10mb' }))

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// CORS middleware to allow cross-origin requests. It MUST be before any route cuz of preflight requests
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// Register cron jobs
if (config.env === 'production') { // ! DO NOT REMOVE: this is to prevent cron from running infinite times in pipeline
  initSchoolHolidayCron()
  initPostCron()
}

// Register routes
app.use(postRoutes)
app.use(roleRoutes)
app.use(scheduleRoutes)
app.use(categoryRoutes)
app.use(homeQuickRoutes)
app.use(logRoutes)
app.use(schoolHolidayRoutes)
app.use(userRoutes)
app.use(popupRoutes)
app.use(menuRoutes)
app.use(contactRoutes)
app.use(mediaRoutes)
app.use(authRoutes)
app.use(globalRoutes)

// Serve uploaded media files statically
app.use(`/${MEDIA_UPLOAD_URL}`, express.static(MEDIA_UPLOAD_DIR, {
  maxAge: '1d',
}))

// Serve favicon
app.use('/favicon.ico', express.static(path.resolve('public/favicon.ico'), {
  maxAge: '365d',
  immutable: true, // Tell browsers to cache the favicon for a loooong time
}))

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Backend server is healthy',
    timestamp: new Date().toISOString(),
  } as Return)
})

// Serve Swagger documentation
if (config.env === 'development') {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  Terminal.info('Swagger documentation available at /swagger')
}

// If nothing found above, return 404
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFound('No route here on ' + req.originalUrl + ' with ' + req.method))
  return
})

// Multer error handler (must be before general error handler)
app.use(multerErrorHandler)

// Error handler
app.use(errorMiddleware)

export default app
