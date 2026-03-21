import { RequestHandler, Request } from 'express'
import { verifyAccessToken } from '../utils/jwt.utils'
import { Unauthorized } from '../exceptions/auth.exception'
import { userService } from '../services/user.service'
import { UserAttributesPublic } from '@brz/shared'
import { permissionCheck } from '../utils/auth.utils'
import { Role } from '../models'

/**
 * Extract and validate user from Authorization header.
 * Returns null if no token or invalid.
 */
async function resolveUser(req: Request): Promise<UserAttributesPublic | null> {
    const header = String(req.headers['authorization'] ?? '')
    if (!header.startsWith('Bearer ')) return null

    const token = header.split(' ')[1]
    const payload = verifyAccessToken<{ user_id: number }>(token)
    if (!payload?.user_id) return null

    const user = await userService.getById(payload.user_id)
    if (!user) return null

    const role = await Role.findByPk(user?.role_id)
    if (!role) return null
    const permissions = Array.isArray(role.permissions) ? role.permissions : []

    return {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
        status: user.status,
        permissions
    } as UserAttributesPublic
}

/**
 * Silent auth: populates req.user if a valid token is present, passes through otherwise.
 */
export const softAuthMiddleware: RequestHandler = async (req, _res, next) => {
    try {
        req.user = await resolveUser(req) ?? undefined
    } catch {
        req.user = undefined
    }
    next()
}

/**
 * Strict auth: requires a valid token. 401 if missing or invalid.
 */
export const authMiddleware: RequestHandler = async (req, _res, next) => {
    try {
        const user = await resolveUser(req)
        if (!user) {
            next(new Unauthorized('Invalid or missing authentication'))
            return
        }
        req.user = user
        next()
    } catch {
        next(new Unauthorized('Invalid or expired token'))
    }
}

/**
 * Permission gate: ensures auth then checks permission.
 */
export function permissionMiddleware(context: string, action: string): RequestHandler {
    return async (req, res, next) => {
        if (!req.user) {
            return authMiddleware(req, res, async (err) => {
                if (err) return next(err)
                permissionCheck(req.user!, context, action).then(() => next()).catch(next)
            })
        }
        permissionCheck(req.user, context, action).then(() => next()).catch(next)
    }
}