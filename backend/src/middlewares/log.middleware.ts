// src/middleware/log.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { logService } from '../services/log.service'
import { LogException } from '../exceptions/log.exception'

export const bypasses = ['/', '/health', '/swagger']

export const logMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (bypasses.includes(req.originalUrl)) return next()
        await logService.make(`[${req.method}] ${req.originalUrl}`, 'info', req)
    } catch (error) {
        throw new LogException((error as Error).message ?? 'Logging error')
    }

    next()
}
