export type SocialType = 'facebook' | 'instagram' | 'other'

export interface SocialAttributes {
    id: number
    type: SocialType
    pseudo: string
}