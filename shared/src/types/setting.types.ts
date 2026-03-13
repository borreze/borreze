import { Optional } from 'sequelize'

export interface SettingAttributes {
    id: number
    key: string
    value?: string | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type SettingAttributesCreation = Optional<SettingAttributes, 'id' | 'value' | 'created_at' | 'updated_at'>
export type SettingAttributesUpdate = Optional<SettingAttributes, 'id' | 'key' | 'value' | 'created_at' | 'updated_at'>