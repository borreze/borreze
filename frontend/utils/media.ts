export const mediaUrl = (filePath: string): string => {
    const config = useRuntimeConfig()
    const base = config.public.apiBaseUrl || ''
    return `${base}${filePath}`
}