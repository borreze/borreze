import { BaseException } from './base'

export class DatabaseException extends BaseException {
    constructor(message = 'Database Error') {
        super(message, 500)
    }
}