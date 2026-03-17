import { MEDIA_TYPES_OBJECTS, MediaType } from "../types/media.types"

export function resolveType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType === 'application/pdf') return 'document'
    return 'document'
}

export function sizeToReadable(size: number): string {
    if (size < 1024) return `${size} o`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} Ko`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(0)} Mo`
    return `${(size / (1024 * 1024 * 1024)).toFixed(0)} Go`
}

export function mediaGetIcon(type: MediaType): string {
    const found = MEDIA_TYPES_OBJECTS.find(t => t.value === type)
    return found?.icon || 'ic:round-insert-drive-file'
}

export function mediaGetLabel(type: MediaType): string {
    const found = MEDIA_TYPES_OBJECTS.find(t => t.value === type)
    return found?.label || 'Fichier'
}