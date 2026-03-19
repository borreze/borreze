import multer from 'multer'
import path from 'path'
import { isTypeAllowed, MEDIA_UPLOAD_LIMIT, slugify } from '@brz/shared'
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
        if (isTypeAllowed(file.originalname, file.mimetype)) return cb(null, true)
        cb(new MediaException('Type de fichier non autorisé'))
    }
})