import fs from 'fs'
import path from 'path'
import { MediaException } from '../exceptions/media.exception'

export const cleanFilename = (text: string | null | undefined): string => { // cnat use slugify since it removes too much chars, e.g. "photo de l'été.jpg" -> "photo-de-l-t-jpg"
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

export function makeFilenameUnique(filename: string, dir: string): string {
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