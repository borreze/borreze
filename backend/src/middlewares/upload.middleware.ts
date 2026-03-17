import multer from 'multer'
import path from 'path'
import { MEDIA_UPLOAD_ALLOWED, MEDIA_UPLOAD_LIMIT, slugify } from '@brz/shared'
import { MEDIA_UPLOAD_DIR } from '@brz/shared'
import { MediaException } from '../exceptions/media.exception'

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, MEDIA_UPLOAD_DIR)
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname)
        const name = slugify(path.basename(file.originalname, ext))
        const unique = `${name}-${Date.now()}${ext}`
        cb(null, unique)
    }
})

export const upload = multer({
    storage,
    limits: { fileSize: MEDIA_UPLOAD_LIMIT },
    fileFilter: (_req, file, cb) => {
        const allowed = MEDIA_UPLOAD_ALLOWED
        const ext = path.extname(file.originalname).toLowerCase().slice(1)
        const mime = allowed.test(file.mimetype)
        if (mime && allowed.test(ext)) return cb(null, true)
        cb(new MediaException('Type de fichier non autorisé'))
    }
})