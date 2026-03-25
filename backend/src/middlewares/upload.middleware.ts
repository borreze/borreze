import multer from 'multer'
import { isTypeAllowed, MEDIA_UPLOAD_NB_LIMIT, MEDIA_UPLOAD_SIZE_LIMIT } from '@brz/shared'
import { MEDIA_UPLOAD_DIR } from '@brz/shared'
import { MediaException } from '../exceptions/media.exception'
import { createFilename } from '../utils/media.utils'

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, MEDIA_UPLOAD_DIR)
    },
    filename: (_req, file, cb) => {
        const filename = createFilename(file.originalname, MEDIA_UPLOAD_DIR)
        cb(null, filename)
    }
})

export const upload = multer({
    storage,
    limits: {
        fileSize: MEDIA_UPLOAD_SIZE_LIMIT,
        files: MEDIA_UPLOAD_NB_LIMIT,
    },
    fileFilter: (_req, file, cb) => {
        if (isTypeAllowed(file.originalname, file.mimetype)) return cb(null, true)
        cb(new MediaException('Type de fichier non autorisé'))
    }
})