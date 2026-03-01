import { BaseException } from './base'

export class AuthException extends BaseException {}

export class Unauthorized extends AuthException {
    constructor(message = 'Unauthorized') {
        super(message, 401)
    }
}

export class Forbidden extends AuthException {
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}