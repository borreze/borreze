import { Optional } from 'sequelize'

export interface PostAttributeAttributes {
    id: number
    post_id: number
    key: string
    value?: string | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type PostAttributeAttributesCreation = Optional<PostAttributeAttributes, 'id' | 'value' | 'created_at' | 'updated_at'>
export type PostAttributeAttributesUpdate = Optional<PostAttributeAttributes, 'id' | 'post_id' | 'key' | 'value' | 'created_at' | 'updated_at'>