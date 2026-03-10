// src/middleware/log.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { LogException } from '../exceptions/log.exception'
import { Log } from '../utils/log.utils'

export const bypasses = ['/', '/health', '/swagger']

export const logMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (bypasses.includes(req.originalUrl)) return next()
        await Log.info(`[${req.method}] ${req.originalUrl}`, req)
    } catch (error) {
        throw new LogException((error as Error).message ?? 'Logging error')
    }

    next()
}
