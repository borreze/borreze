import express, { Express, Request, Response } from 'express'
import { Return } from './types/utils/api.types'
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger.json"
import postRoutes from './routes/post.routes'
import categoryRoutes from './routes/category.routes'
import userRoutes from './routes/user.routes'
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

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app: Express = express()

// Parse JSON bodies (as sent by API clients)
app.use(express.json({ limit: '10mb' }))

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// CORS middleware to allow cross-origin requests. It MUST be before any route cuz of preflight requests
app.use(cors({
  origin: process.env.BACKEND_CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// Register cron jobs
if (process.env.NODE_ENV === 'production') { // ! DO NOT REMOVE: this is to prevent cron from running infinite times in pipeline
  initSchoolHolidayCron()
}

// Register routes
app.use(postRoutes)
app.use(categoryRoutes)
app.use(logRoutes)
app.use(schoolHolidayRoutes)
app.use(userRoutes)
app.use(authRoutes)
app.use(globalRoutes)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Backend server is healthy',
    timestamp: new Date().toISOString(),
  } as Return)
})

// Serve Swagger documentation
if (process.env.NODE_ENV === 'development') {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  Terminal.info('Swagger documentation available at /swagger')
}

// If nothing found above, return 404
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFound('No route here on ' + req.originalUrl + ' with ' + req.method))
  return
})

// Error handler
app.use(errorMiddleware)

export default app
