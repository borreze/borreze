import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { Forbidden, Unauthorized } from '../exceptions/auth.exception'
import { canDo, UserAttributes, UserAttributesFrontend, UserAttributesPublic } from '@brz/shared'
import { config } from '../config/config'

export async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, Number(config.bcryptSaltRounds))
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
}

export function isHash(str: string): boolean {
    return str.startsWith('$2b$') && str.length === 60
}

export function randomTokenString(bytes: number = 48): string {
    return crypto.randomBytes(bytes).toString('hex')
}

export function randomNumericCode(length: number = 6): string {
    const min = 10 ** (length - 1)
    const max = 10 ** length - 1
    return String(Math.floor(Math.random() * (max - min + 1) + min))
}

export function sanitizeUser(user: UserAttributes | UserAttributesFrontend | null): Omit<UserAttributes, 'password'> | UserAttributesFrontend | null {
    if (!user) return null

    const plain = 'toJSON' in user && typeof user.toJSON === 'function' ? user.toJSON() : { ...user }
    delete (plain as Record<string, unknown>).password

    return plain
}

export function sanitizeUsers(users: UserAttributes[] | UserAttributesFrontend[]): UserAttributes[] | UserAttributesFrontend[] {
    return users.map(sanitizeUser) as UserAttributes[] | UserAttributesFrontend[]
}

export function userCheck(user: UserAttributesPublic | null | undefined): boolean {
    if (!user?.role_id) throw new Unauthorized('User not authenticated')
    if (user?.status !== 'active') throw new Unauthorized('Account is not active')

    return true
}

export async function permissionCheck(user: UserAttributesPublic | null | undefined, context: string, action: string): Promise<void> {
    if (!user?.role_id) throw new Unauthorized('User not authenticated')
    if (user?.status !== 'active') throw new Unauthorized('Account is not active')

    const allowed = canDo(user, context, action)
    if (!allowed) throw new Forbidden('Insufficient permissions')
}