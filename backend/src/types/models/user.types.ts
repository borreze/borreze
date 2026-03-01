import { Optional } from 'sequelize'
import { USER_STATUSES } from '../../models/user.model'

export type UserStatus = typeof USER_STATUSES[number]

export interface UserAttributes {
    id: number
    email: string
    password: string
    username: string
    first_name?: string | null
    last_name?: string | null
    email_verified_at?: Date | null
    role_id: number
    status: UserStatus
    created_at: Date
    updated_at: Date
}

export type UserAttributesPublic = Pick<UserAttributes, 'id' | 'email' | 'username' | 'role_id' | 'status'>
export type UserAttributesCreation = Optional<UserAttributes, 'id' | 'first_name' | 'last_name' | 'email_verified_at' | 'created_at' | 'updated_at'>
export type UserAttributesUpdate = Optional<UserAttributes, 'id' | 'email' | 'password' | 'username' | 'first_name' | 'last_name' | 'email_verified_at' | 'role_id' | 'status' | 'created_at' | 'updated_at'>