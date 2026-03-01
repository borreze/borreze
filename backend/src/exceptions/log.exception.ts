import { BaseException } from './base'

export class LogException extends BaseException {
    constructor(message = 'Log Error') {
        super(message, 500)
    }
}