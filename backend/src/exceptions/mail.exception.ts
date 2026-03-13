import { BaseException } from './base'

export class MailException extends BaseException {
    constructor(message = 'Mailing Error') {
        super(message, 500)
    }
}