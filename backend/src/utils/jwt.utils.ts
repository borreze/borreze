import jwt from 'jsonwebtoken'
import { AccessTokenPayload } from '../types/utils/jwt.types'
import { config } from '../config/config'

export function signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpires })
}

export function verifyAccessToken<T = AccessTokenPayload>(token: string): T {
    return jwt.verify(token, config.jwtSecret) as T
}
