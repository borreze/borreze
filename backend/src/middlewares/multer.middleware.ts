import { ErrorRequestHandler } from 'express'
import { MEDIA_UPLOAD_NB_LIMIT, MEDIA_UPLOAD_SIZE_LIMIT } from '@brz/shared'
import { sizeToReadable } from '@brz/shared'
import multer from 'multer'

export const multerErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const messages: Record<string, string> = {
            LIMIT_FILE_SIZE: `Le fichier dépasse la taille maximale autorisée (${sizeToReadable(MEDIA_UPLOAD_SIZE_LIMIT, 0)})`,
            LIMIT_FILE_COUNT: `Le nombre de fichiers dépasse la limite autorisée (${MEDIA_UPLOAD_NB_LIMIT})`,
            LIMIT_UNEXPECTED_FILE: 'Champ de fichier inattendu',

        }

        res.status(400).json({ message: messages[err.code] ?? 'Erreur inconnue' })
        return
    }

    next(err)
}