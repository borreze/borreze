import { UserStatus } from "@brz/shared"

export interface AccessTokenPayload {
    user_id: number
    email: string
    username: string
    role_id: number,
    status: UserStatus
}