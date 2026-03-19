import { MEDIA_TYPES_OBJECTS, MEDIA_UPLOAD_ALLOWED, MediaType } from "../types/media.types"

export function resolveType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType === 'application/pdf') return 'document'
    return 'document'
}

export function isTypeAllowed(filename: string = '', mimetype: string = ''): boolean {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    if (
        (mimetype && MEDIA_UPLOAD_ALLOWED.test(mimetype)) ||
        (ext && MEDIA_UPLOAD_ALLOWED.test(ext))
    ) return true
    return false
}

export function sizeToReadable(size: number, decimalPlaces: number = 2): string {
    if (size < 1024) return `${size} o`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(decimalPlaces)} Ko`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(decimalPlaces)} Mo`
    return `${(size / (1024 * 1024 * 1024)).toFixed(decimalPlaces)} Go`
}

export function mediaGetIcon(type: MediaType): string {
    const found = MEDIA_TYPES_OBJECTS.find(t => t.value === type)
    return found?.icon || 'ic:round-insert-drive-file'
}

export function mediaGetLabel(type: MediaType): string {
    const found = MEDIA_TYPES_OBJECTS.find(t => t.value === type)
    return found?.label || 'Fichier'
}