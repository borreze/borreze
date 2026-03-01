import { Optional } from 'sequelize'
export interface AssociationAttributes {
    id: number
    slug: string
    title: string
    description?: string | null
    cover_id?: number | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    website?: string | null
    meta_title?: string | null
    meta_description?: string | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type AssociationAttributesCreation = Optional<AssociationAttributes, 'id' | 'cover_id' | 'description' | 'meta_title' | 'meta_description' | 'contact_name' | 'contact_email' | 'contact_phone' | 'website' | 'created_at' | 'updated_at'>
export type AssociationAttributesUpdate = Optional<AssociationAttributes, 'id' | 'slug' | 'title' | 'cover_id' | 'description' | 'meta_title' | 'meta_description' | 'contact_name' | 'contact_email' | 'contact_phone' | 'website' | 'created_at' | 'updated_at'>