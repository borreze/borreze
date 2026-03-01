export interface AuthPasswordResetTokenAttributes {
    id?: number
    user_id: number
    code_hash: string // store hash of code
    expires_at: Date
    used: boolean
    created_at?: Date | null
    updated_at?: Date | null
}