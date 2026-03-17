import { BaseException } from './base'

export class MediaException extends BaseException {
    constructor(message = 'Media Error') {
        super(message, 500)
    }
}