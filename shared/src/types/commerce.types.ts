import { Optional } from 'sequelize'

export interface CommerceAttributes {
    id: number
    slug: string
    title: string
    description?: string | null
    cover_id?: number | null
    contact_name?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    address?: string | null
    website?: string | null
    latitude?: number | null
    longitude?: number | null
    meta_title?: string | null
    meta_description?: string | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type CommerceAttributesCreation = Optional<CommerceAttributes, 'id' | 'cover_id' | 'description' | 'meta_title' | 'meta_description' | 'contact_name' | 'contact_email' | 'contact_phone' | 'address' | 'website' | 'latitude' | 'longitude' | 'created_at' | 'updated_at'>
export type CommerceAttributesUpdate = Optional<CommerceAttributes, 'id' | 'slug' | 'cover_id' | 'description' | 'meta_title' | 'meta_description' | 'title' | 'contact_name' | 'contact_email' | 'contact_phone' | 'address' | 'website' | 'latitude' | 'longitude' | 'created_at' | 'updated_at'>