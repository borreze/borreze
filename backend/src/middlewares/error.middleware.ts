import { ErrorRequestHandler } from 'express'
import { BaseException } from '../exceptions/base'
import { Return } from '../types/utils/api.types'
import { Terminal } from '../utils/terminal.utils'
import { ValidationException } from '../exceptions/validation.exception'

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, next) => {
    if (res.headersSent) next(err) // If headers are already sent, delegate to the default Express error handler

    const obfuscate: boolean = process.env.NODE_ENV === 'production'

    const message = obfuscate ? 'An error occurred' : (err.message)
    const code = err instanceof BaseException ? err.code : 500
    const errors = err instanceof ValidationException ? err.errors : null

    Terminal.error(`Error: ${message}`)

    res.status(code).json({ message, ...(errors ? { errors } : {}) } as Return)
}
