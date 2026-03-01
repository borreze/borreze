import { BaseException } from './base'

export class HttpException extends BaseException { }

export class BadRequest extends HttpException {
    constructor(message = 'Bad Request') {
        super(message, 400)
    }
}

export class NotFound extends HttpException {
    constructor(message = 'Not Found') {
        super(message, 404)
    }
}

export class NoContent extends HttpException {
    constructor(message = 'No Content') {
        super(message, 200) // No Content is 204, but we use 200 to avoid issues with empty responses
    }
}