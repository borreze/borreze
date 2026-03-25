import path from 'path'
import fs from 'fs'
import { MediaException } from '../exceptions/media.exception'
import { MEDIA_UPLOAD_DIR } from '@brz/shared'

export const normalizeFilename = (text: string | null | undefined): string => { // cant use slugify since it removes too much chars, e.g. "photo de l'été.jpg" -> "photo-de-l-t-jpg"
    if (!text) return ''

    return text
        .toString()
        .normalize('NFD')                     // separate accent from letter
        .replace(/[\u0300-\u036f]/g, '')      // remove all accents
        .toLowerCase()
        .trim()
        .replace(/['’]/g, '-')                // replace apostrophes
        .replace(/\s+/g, '-')                 // spaces -> -
        .replace(/--+/g, '-')                 // multiple - -> single -
        .replace(/^-+/, '')                   // trim - start
        .replace(/-+$/, '')                   // trim - end
}

export function uniqueFilename(filename: string, dir: string): string {
    const MAX_UNIQUE_ATTEMPTS = 100

    const ext = path.extname(filename)          // ".jpg"
    const base = path.basename(filename, ext)   // "photo"

    for (let i = 0; i < MAX_UNIQUE_ATTEMPTS; i++) {
        const candidate = i === 0
            ? `${base}${ext}`
            : `${base}-${i}${ext}`

        if (!fs.existsSync(path.join(dir, candidate))) {
            return candidate
        }
    }

    throw new MediaException(`Unable to generate a unique filename for "${filename}" after ${MAX_UNIQUE_ATTEMPTS} attempts`)
}

export function createFilename(filename: string, dir: string): string {
    return uniqueFilename(normalizeFilename(filename), dir)
}

export async function mediaDeleteFile(filename: string): Promise<void> {
    const filePath = path.join(MEDIA_UPLOAD_DIR, filename)
    await fs.promises.unlink(filePath).catch(err => {
        if (err.code !== 'ENOENT') { // ignore file not found errors
            throw new MediaException(`Failed to delete file "${filename}": ${err.message}`)
        }
    })
}