import { MEDIA_UPLOAD_URL } from "@brz/shared"

export const MEDIA_URL_DEFAULT_CARD = '/utils/placeholder.webp'
export const MEDIA_URL_DEFAULT_HERO = '/photos/borreze-depuis-coline.webp'

export const mediaUrl = (filename: string): string => {
    const config = useRuntimeConfig()
    const base = config.public.apiBaseUrl || ''
    return `${base}/${MEDIA_UPLOAD_URL}/${filename}`
}