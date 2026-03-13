import { AuthRefreshToken, AuthPasswordResetToken } from '../models'
import { sequelize } from '../config/database'
import { Op } from 'sequelize'
import { hashPassword, comparePassword, randomTokenString, randomNumericCode } from '../utils/auth.utils'
import { signAccessToken, verifyAccessToken } from '../utils/jwt.utils'
import { emailService } from './email.service'
import { userService } from '../services/user.service'
import { BadRequest, NotFound } from '../exceptions/request.exception'
import { AuthException } from '../exceptions/auth.exception'
import { UserAttributesFrontend } from '@brz/shared'

export class AuthService {
    public async getCurrentUser(accessToken: string): Promise<UserAttributesFrontend> {
        const payload = verifyAccessToken(accessToken)
        const user = await userService.getById(payload.user_id)

        if (!user) throw new NotFound('User not found')

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            role_id: user.role_id,
            status: user.status
        }
    }

    public async login(emailOrUsername: string, password: string): Promise<{ accessToken: string, refreshToken: string, user: UserAttributesFrontend }> {
        if (!emailOrUsername || !password) throw new BadRequest('Missing credentials')

        const user = await userService.getByEmailOrUsername(emailOrUsername)
        if (!user) throw new AuthException('Invalid credentials')
        if (!user.password) throw new AuthException('Invalid credentials')

        if (user.status !== 'active') throw new AuthException('Account is not active')

        const passwordOk = await comparePassword(password, user.password)
        if (!passwordOk) throw new AuthException('Invalid credentials')

        // create tokens
        const accessToken = signAccessToken({
            user_id: user.id,
            email: user.email,
            username: user.username,
            role_id: user.role_id,
            status: user.status
        })

        const refreshTokenString = randomTokenString(32)
        const expiresAt = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)) // 30 days

        await AuthRefreshToken.create({
            token: refreshTokenString,
            user_id: user.id,
            expires_at: expiresAt
        })

        return {
            accessToken,
            refreshToken: refreshTokenString,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                role_id: user.role_id,
                status: user.status
            }
        }
    }

    public async refreshToken(oldRefreshToken: string) {
        if (!oldRefreshToken) throw new BadRequest('Missing refresh token')

        const record = await AuthRefreshToken.findOne({ where: { token: oldRefreshToken } })
        if (!record) throw new AuthException('Invalid refresh token')

        if (record.expires_at < new Date()) {
            // remove expired
            await record.destroy()
            throw new AuthException('Refresh token expired')
        }

        // load user
        const user = await userService.getById(record.user_id)
        if (!user) throw new NotFound('User not found')

        // optionally rotate: delete old token & issue new one
        await record.destroy()
        const newRefresh = randomTokenString(32)
        const expiresAt = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)) // 30 days

        await AuthRefreshToken.create({
            token: newRefresh,
            user_id: user.id,
            expires_at: expiresAt
        })

        const accessToken = signAccessToken({
            user_id: user.id,
            email: user.email,
            username: user.username,
            role_id: user.role_id,
            status: user.status
        })

        return { accessToken, refreshToken: newRefresh }
    }

    public async logout(refreshToken: string) {
        if (!refreshToken) throw new BadRequest('Missing refresh token')

        const deleted = await AuthRefreshToken.destroy({ where: { token: refreshToken } })
        return deleted > 0
    }

    public async sendPasswordResetCode(email: string) {
        if (!email) throw new BadRequest('Missing email')

        const user = await userService.getByEmail(email)
        if (!user) throw new NotFound('User not found')

        const code = randomNumericCode(6)
        const codeHash = await hashPassword(code) // hash code before storing
        const expiresAt = new Date(Date.now() + (1000 * 60 * 15)) // 15 minutes

        // store token
        await AuthPasswordResetToken.create({
            user_id: user.id,
            code_hash: codeHash,
            expires_at: expiresAt,
            used: false
        })

        // send email (plain text + html optional)
        await emailService.sendMail({
            to: user.email,
            subject: 'Password reset code',
            text: `Votre code de réinitialisation : ${code} (valable 15 minutes)`
        })

        // For security, do not return code in API
        return true
    }

    public async resetPassword(email: string, code: string, newPassword: string) {
        if (!email || !code || !newPassword) throw new BadRequest('Missing fields')

        const user = await userService.getByEmail(email)
        if (!user) throw new NotFound('User not found')

        // find not-used tokens for that user unexpired, order by created_at desc
        const token = await AuthPasswordResetToken.findOne({
            where: {
                user_id: user.id,
                used: false,
                expires_at: { [Op.gt]: new Date() }
            },
            order: [['created_at', 'DESC']]
        })

        if (!token) throw new AuthException('No valid reset token found')

        const match = await comparePassword(code, token.code_hash)
        if (!match) throw new AuthException('Invalid code')

        // mark used + update password inside a transaction
        await sequelize.transaction(async () => {
            await token.update({ used: true })
            const newHash = await hashPassword(newPassword)
            await userService.update(user.id, { password: newHash })
        })

        return true
    }

    public async revokeAllRefreshTokensForUser(user_id: number) {
        await AuthRefreshToken.destroy({ where: { user_id: user_id } })
        return true
    }
}

export const authService = new AuthService()
