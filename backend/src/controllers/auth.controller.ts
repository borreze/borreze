import { RequestHandler } from 'express'
import { authService } from '../services/auth.service'
import { Return } from '../types/utils/api.types'
import { Log } from '../utils/log.utils'

export class AuthController {
    public me: RequestHandler = async (req, res) => {
        const accessToken = req.headers['authorization']?.split(' ')[1] || ''

        const user = await authService.getCurrentUser(accessToken)
        // Log.notice(`Utilisateur de l'email ${user.email} a récupéré ses informations`, req, false) // ! Commented to avoid logging every request to /me, which can be very frequent
        res.status(200).json({ data: user, message: 'User info retrieved' } as Return)
    }

    public login: RequestHandler = async (req, res) => {
        const { identifier, password } = req.body

        const result = await authService.login(identifier, password)
        Log.notice(`L'utilisateur avec l'email ${result.user.email} s'est connecté`, req, false)
        res.status(200).json({ data: result, message: 'Login successful' } as Return)
    }

    public refresh: RequestHandler = async (req, res) => {
        const { refreshToken } = req.body

        const tokens = await authService.refreshToken(refreshToken)
        Log.notice(`Un utilisateur a rafraîchi son token`, req, false)
        res.status(200).json({ data: tokens, message: 'Token refreshed' } as Return)
    }

    public logout: RequestHandler = async (req, res) => {
        const { refreshToken } = req.body

        await authService.logout(refreshToken)
        Log.notice(`Un utilisateur s'est déconnecté`, req, false)
        res.status(200).json({ message: 'Logged out' } as Return)
    }

    public sendResetCode: RequestHandler = async (req, res) => {
        const { email } = req.body

        await authService.sendPasswordResetCode(email)
        Log.notice(`Un code de réinitialisation de mot de passe a été demandé pour l'utilisateur de email ${email}`, req, false)
        res.status(200).json({ message: 'Reset code sent if account exists' } as Return)
    }

    public resetPassword: RequestHandler = async (req, res) => {
        const { email, code, newPassword } = req.body

        await authService.resetPassword(email, code, newPassword)
        Log.notice(`Un nouveau mot de passe a été défini pour l'utilisateur de email ${email}`, req, false)
        res.status(200).json({ message: 'Password reset successful' } as Return)
    }
}

export const authController = new AuthController()
