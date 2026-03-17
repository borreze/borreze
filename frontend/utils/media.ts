
const config = useRuntimeConfig()

export const mediaUrl = (filePath: string) => {
    const base = config.public.apiBaseUrl || ''
    return `${base}${filePath}`
}