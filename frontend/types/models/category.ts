export const CATEGORIZABLE_TYPES = ['post', 'event', 'project', 'commerce', 'association'] as const
export type CategorizableType = typeof CATEGORIZABLE_TYPES[number]

export interface CategoryAttributes {
    id: number
    name: string
    slug: string
    created_at?: Date | null
    updated_at?: Date | null
}