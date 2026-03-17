import { MediaType } from "../types/media.types"

export function resolveType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType === 'application/pdf') return 'document'
    return 'document'
}

export function sizeToReadable(size: number): string {
    if (size < 1024) return `${size} o`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} Ko`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} Mo`
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} Go`
}