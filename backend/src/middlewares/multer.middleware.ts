import { ErrorRequestHandler } from 'express'
import { MEDIA_UPLOAD_LIMIT } from '@brz/shared'
import multer from 'multer'
import { sizeToReadable } from '@brz/shared'

export const multerErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const messages: Record<string, string> = {
            LIMIT_FILE_SIZE: `Le fichier dépasse la taille maximale autorisée (${sizeToReadable(MEDIA_UPLOAD_LIMIT)})`,
            LIMIT_FILE_COUNT: 'Trop de fichiers envoyés',
            LIMIT_UNEXPECTED_FILE: 'Champ de fichier inattendu',
        }

        res.status(400).json({ message: messages[err.code] ?? 'Erreur inconnue' })
        return
    }

    next(err)
}