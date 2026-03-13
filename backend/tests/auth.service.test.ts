import { authService } from '../src/services/auth.service'
import { AuthRefreshToken, AuthPasswordResetToken } from '../src/models'
import { userService } from '../src/services/user.service'
import { emailService } from '../src/services/email.service'
import * as jwtUtils from '../src/utils/jwt.utils'
import * as authUtils from '../src/utils/auth.utils'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { UserStatus } from '@brz/shared'

jest.mock('../src/models')
jest.mock('../src/services/user.service')
jest.mock('../src/services/email.service')
jest.mock('../src/utils/auth.utils')
jest.mock('../src/utils/jwt.utils')

const mockedUserService = userService as jest.Mocked<typeof userService>
const mockedEmailService = emailService as jest.Mocked<typeof emailService>
const mockedJwtUtils = jwtUtils as jest.Mocked<typeof jwtUtils>
const mockedAuthUtils = authUtils as jest.Mocked<typeof authUtils>
const mockedAuthRefreshToken = AuthRefreshToken as jest.Mocked<typeof AuthRefreshToken>
const mockedAuthPasswordResetToken = AuthPasswordResetToken as jest.Mocked<typeof AuthPasswordResetToken>

const mockUser = {
    id: 1,
    email: 'john@example.com',
    username: 'johnny',
    first_name: 'John',
    last_name: 'Dupont',
    password: 'hashed123',
    status: 'active' as UserStatus,
    role_id: 2,
    created_at: new Date(),
    updated_at: new Date()
}

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('login', () => {
        it('should login successfully and return tokens', async () => {
            mockedUserService.getByEmail.mockResolvedValue(mockUser)
            mockedUserService.getByEmailOrUsername.mockResolvedValue(mockUser)
            mockedAuthUtils.comparePassword.mockResolvedValue(true)
            mockedJwtUtils.signAccessToken.mockReturnValue('access_token')
            mockedAuthUtils.randomTokenString.mockReturnValue('refresh_token')
            mockedAuthRefreshToken.create.mockResolvedValue({})

            const result = await authService.login(mockUser.email, 'password')

            expect(result.accessToken).toBe('access_token')
            expect(result.refreshToken).toBe('refresh_token')
            expect(mockedAuthRefreshToken.create).toHaveBeenCalled()
        })

        it('should throw on invalid password', async () => {
            mockedUserService.getByEmail.mockResolvedValue(mockUser)
            mockedUserService.getByEmailOrUsername.mockResolvedValue(mockUser)
            mockedAuthUtils.comparePassword.mockResolvedValue(false)

            await expect(authService.login(mockUser.email, 'wrongpass')).rejects.toThrow('Invalid credentials')
        })
    })


    describe('refreshToken', () => {
        const mockRefreshRecord = {
            token: 'old_token',
            expires_at: new Date(Date.now() + 10000),
            user_id: mockUser.id,
            destroy: jest.fn().mockResolvedValue(1 as never) // Changed from true to 1 cuz AuthRefreshToken.destroy returns number
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any // Cast to any to avoid type issues in tests (we only care about certain fields)

        it('should refresh tokens successfully', async () => {
            mockedAuthRefreshToken.findOne.mockResolvedValue(mockRefreshRecord)
            mockedUserService.getById.mockResolvedValue(mockUser)
            mockedAuthUtils.randomTokenString.mockReturnValue('new_refresh_token')
            mockedAuthRefreshToken.create.mockResolvedValue({})
            mockedJwtUtils.signAccessToken.mockReturnValue('new_access_token')

            const result = await authService.refreshToken('old_token')

            expect(result.accessToken).toBe('new_access_token')
            expect(result.refreshToken).toBe('new_refresh_token')
            expect(mockRefreshRecord.destroy).toHaveBeenCalled()
        })

        it('should throw if refresh token not found', async () => {
            mockedAuthRefreshToken.findOne.mockResolvedValue(null)

            await expect(authService.refreshToken('invalid')).rejects.toThrow('Invalid refresh token')
        })
    })


    describe('logout', () => {
        it('should delete refresh token successfully', async () => {
            mockedAuthRefreshToken.destroy.mockResolvedValue(1)

            const result = await authService.logout('token')

            expect(result).toBe(true)
            expect(mockedAuthRefreshToken.destroy).toHaveBeenCalled()
        })
    })


    describe('sendPasswordResetCode', () => {
        it('should send reset code', async () => {
            mockedUserService.getByEmail.mockResolvedValue(mockUser)
            mockedUserService.getByEmailOrUsername.mockResolvedValue(mockUser)
            mockedAuthUtils.randomNumericCode.mockReturnValue('123456')
            mockedAuthUtils.hashPassword.mockResolvedValue('hashed_code')
            mockedAuthPasswordResetToken.create.mockResolvedValue({})
            mockedEmailService.sendMail.mockResolvedValue()

            const result = await authService.sendPasswordResetCode(mockUser.email)

            expect(result).toBe(true)
            expect(mockedEmailService.sendMail).toHaveBeenCalled()
        })

        it('should throw if user not found', async () => {
            mockedUserService.getByEmail.mockResolvedValue(null)
            mockedUserService.getByEmailOrUsername.mockResolvedValue(null)

            await expect(authService.sendPasswordResetCode('missing@mail.com')).rejects.toThrow(Error('User not found'))
        })
    })
})
