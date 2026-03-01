import { BaseException } from './base'

export class PaginationException extends BaseException {
    constructor(message = 'Pagination Error') {
        super(message, 400)
    }
}