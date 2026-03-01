export interface AuthRefreshTokenAttributes {
    id?: number
    token: string
    user_id: number
    expires_at: Date
    created_at?: Date | null
    updated_at?: Date | null
}
