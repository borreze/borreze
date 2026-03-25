import app from './app'
import morgan from 'morgan'
import helmet from 'helmet'
import { Terminal } from './utils/terminal.utils'
import createRateLimiter from './middlewares/limiter.middleware'

// Middleware to enhance security by setting various HTTP headers
app.use(helmet())

// Logging middleware
app.use(morgan('combined'))

// Default rate limiter for all requests
app.use(createRateLimiter())

const IP = '0.0.0.0'
const PORT = 3000 // ! Port hardcoded here: docker expects it to be 3000
app.listen(PORT, IP, () => {
    Terminal.success(`Server is running on internal address http://${IP}:${PORT}`)
})
