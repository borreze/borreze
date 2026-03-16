import { BaseException } from './base'

export class ContactException extends BaseException {
    constructor(message = 'Contact Error') {
        super(message, 400)
    }
}