import crypto from 'crypto'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { roleService } from '../services/role.service'
import { Forbidden, Unauthorized } from '../exceptions/auth.exception'
import { UserAttributesPublic } from '../types/models/user.types'

dotenv.config()

const SALT_ROUNDS = Number(process.env.BACKEND_BCRYPT_SALT_ROUNDS ?? 12)

export async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
}

export function isHash(str: string): boolean {
    return str.startsWith('$2b$') && str.length === 60
}

export function isStrongPassword(password: string, min: number = 8): boolean | number {
    if (min < 1 || min > 10) throw new Error('min must be between 1 and 10')

    let score = 0

    if (password.length >= 8) score += 2
    if (password.length >= 12) score += 1
    if (/[A-Z]/.test(password)) score += 2 // uppercase
    if (/[a-z]/.test(password)) score += 2 // lowercase
    if (/[0-9]/.test(password)) score += 2 // number
    if (/[^A-Za-z0-9]/.test(password)) score += 1 // special char

    return score >= min
}

export function randomTokenString(bytes: number = 48): string {
    return crypto.randomBytes(bytes).toString('hex')
}

export function randomNumericCode(length: number = 6): string {
    const min = 10 ** (length - 1)
    const max = 10 ** length - 1
    return String(Math.floor(Math.random() * (max - min + 1) + min))
}

export async function permissionCheck(user: UserAttributesPublic | null | undefined, context: string, action: string): Promise<void> {
    if (!user?.role_id) throw new Unauthorized('User not authenticated')
    if (user?.status !== 'active') throw new Unauthorized('Account is not active')

    const allowed = await roleService.canDo(user.role_id, context, action)
    if (!allowed) throw new Forbidden('Insufficient permissions')
}