import path from 'path'
import fs from 'fs'
import { MediaException } from '../exceptions/media.exception'
import { MEDIA_UPLOAD_DIR, MEDIA_UPLOAD_UNIQUE_ATTEMPTS, normalize } from '@brz/shared'

const normalizeFilename = (text: string | null | undefined): string => normalize(text, true)

function uniqueFilename(filename: string, dir: string): string {
    const ext = path.extname(filename)          // ".jpg"
    const base = path.basename(filename, ext)   // "photo"

    for (let i = 0; i < MEDIA_UPLOAD_UNIQUE_ATTEMPTS; i++) {
        const candidate = i === 0
            ? `${base}${ext}`
            : `${base}-${i}${ext}`

        if (!fs.existsSync(path.join(dir, candidate))) {
            return candidate
        }
    }

    throw new MediaException(`Unable to generate a unique filename for "${filename}" after ${MEDIA_UPLOAD_UNIQUE_ATTEMPTS} attempts`)
}

export function mediaMakeFilename(filename: string, dir: string): string {
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