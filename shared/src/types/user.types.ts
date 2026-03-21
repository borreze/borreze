import { Optional } from 'sequelize'

export const USER_ROLE_ID_DEFAULT = 2 // Default role for new users

export const USER_STATUSES_KEYS = ['active', 'inactive', 'banned'] as const
export type UserStatus = typeof USER_STATUSES_KEYS[number]
export const USER_STATUSES_OBJECTS: { value: UserStatus, label: string, color?: string }[] = [
    { value: 'active', label: 'Actif', color: '#349c17' },
    { value: 'inactive', label: 'Inactif', color: '#ffae00' },
    { value: 'banned', label: 'Banni', color: '#ab0a0a' },
]

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

export type UserAttributesFrontend = Pick<UserAttributes, 'id' | 'email' | 'username' | 'first_name' | 'last_name' | 'role_id' | 'status'>
export type UserAttributesPublic = Pick<UserAttributes, 'id' | 'email' | 'username' | 'role_id' | 'status'> & { permissions: string[] }
export type UserAttributesCreation = Optional<UserAttributes, 'id' | 'first_name' | 'last_name' | 'email_verified_at' | 'created_at' | 'updated_at'>
export type UserAttributesUpdate = Optional<UserAttributes, 'id' | 'email' | 'password' | 'username' | 'first_name' | 'last_name' | 'email_verified_at' | 'role_id' | 'status' | 'created_at' | 'updated_at'>