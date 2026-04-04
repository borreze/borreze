import { Optional } from "sequelize"

export interface PostMediaAttributes {
    post_id: number
    media_id: number
    order?: number | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type PostMediaAttributesCreation = Optional<PostMediaAttributes, 'created_at' | 'updated_at'>
export type PostMediaAttributesUpdate = Optional<PostMediaAttributes, 'post_id' | 'media_id' | 'order' | 'created_at' | 'updated_at'>