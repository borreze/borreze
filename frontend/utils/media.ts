export const MEDIA_URL_DEFAULT_CARD = '/images/placeholder.webp'
export const MEDIA_URL_DEFAULT_HERO = '/images/borreze-depuis-coline.webp'

export const mediaUrl = (filePath: string): string => {
    const config = useRuntimeConfig()
    const base = config.public.apiBaseUrl || ''
    return `${base}${filePath}`
}