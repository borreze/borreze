import { Optional } from 'sequelize'

export interface RoleAttributes {
    id: number
    name: string
    permissions?: object | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type RoleAttributesCreation = Optional<RoleAttributes, 'id' | 'permissions' | 'created_at' | 'updated_at'>
export type RoleAttributesUpdate = Optional<RoleAttributes, 'id' | 'name' | 'permissions' | 'created_at' | 'updated_at'>