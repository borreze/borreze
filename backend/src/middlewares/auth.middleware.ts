import { RequestHandler } from 'express'
import { verifyAccessToken } from '../utils/jwt.utils'
import { Unauthorized } from '../exceptions/auth.exception'
import { Request, Response, NextFunction } from 'express'
import { userService } from '../services/user.service'
import { UserAttributesPublic } from '@brz/shared'
import { permissionCheck } from '../utils/auth.utils'

export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = String(req.headers['authorization'] ?? '')
        if (!header || !header.startsWith('Bearer ')) {
            next(new Unauthorized('Missing authorization header'))
            return
        }

        const token = header.split(' ')[1]
        const payload = verifyAccessToken<{ user_id: number }>(token)
        if (!payload || !payload.user_id) {
            next(new Unauthorized('Invalid token'))
            return
        }

        const user = await userService.getById(payload.user_id)
        if (!user) {
            next(new Unauthorized('User not found'))
            return
        }

        req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            role_id: user.role_id,
            status: user.status
        } as UserAttributesPublic

        next()
    } catch {
        next(new Unauthorized('Invalid or expired token'))
    }
}

export function permissionMiddleware(context: string, action: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Calling authMiddleware to ensure req.user is populated
        if (!req.user || !req.user.role_id) {
            await authMiddleware(req, res, async (err) => {
                if (err) {
                    next(err)
                    return
                }
            })
        }

        await permissionCheck(req.user, context, action).then(() => {
            next()
        }).catch((err) => {
            next(err)
        })
    }
}
