import { BaseException } from './base'

export class ImportException extends BaseException {
    constructor(message = 'Import Error') {
        super(message, 500)
    }
}