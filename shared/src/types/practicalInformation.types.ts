import { Optional } from 'sequelize'

export interface PracticalInformationAttributes {
    id: number
    title: string
    content: string
    order: number
    created_at?: Date | null
    updated_at?: Date | null
}

export type PracticalInformationAttributesCreation = Optional<PracticalInformationAttributes, 'id' | 'created_at' | 'updated_at'>
export type PracticalInformationAttributesUpdate = Optional<PracticalInformationAttributes, 'id' | 'title' | 'content' | 'order' | 'created_at' | 'updated_at'>