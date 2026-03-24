import { RequestHandler } from 'express'
import { authService } from '../services/auth.service'
import { Return } from '../types/utils/api.types'
import { Log } from '../utils/log.utils'

export class AuthController {
    public me: RequestHandler = async (req, res) => {
        const accessToken = req.headers['authorization']?.split(' ')[1] || ''

        const user = await authService.getCurrentUser(accessToken)
        res.status(200).json({ data: user, message: 'User info retrieved' } as Return)
    }

    public login: RequestHandler = async (req, res) => {
        const { identifier, password } = req.body

        const result = await authService.login(identifier, password)
        Log.info(`User of email ${result.user.email} logged in`)
        res.status(200).json({ data: result, message: 'Login successful' } as Return)
    }

    public refresh: RequestHandler = async (req, res) => {
        const { refreshToken } = req.body

        const tokens = await authService.refreshToken(refreshToken)
        res.status(200).json({ data: tokens, message: 'Token refreshed' } as Return)
    }

    public logout: RequestHandler = async (req, res) => {
        const { refreshToken } = req.body

        await authService.logout(refreshToken)
        res.status(200).json({ message: 'Logged out' } as Return)
    }

    public sendResetCode: RequestHandler = async (req, res) => {
        const { email } = req.body

        await authService.sendPasswordResetCode(email)
        Log.info(`Sent password reset code to user of email ${email}`)
        res.status(200).json({ message: 'Reset code sent if account exists' } as Return)
    }

    public resetPassword: RequestHandler = async (req, res) => {
        const { email, code, newPassword } = req.body

        await authService.resetPassword(email, code, newPassword)
        Log.info(`New password set for user of email ${email}`)
        res.status(200).json({ message: 'Password reset successful' } as Return)
    }
}

export const authController = new AuthController()
