import { ValidationError } from '@brz/shared'
import { BaseException } from './base'

export class ValidationException extends BaseException {
    public errors: ValidationError[]

    constructor(message = 'Validation failed', errors?: ValidationError[]) {
        super(message, 422)
        this.errors = errors ?? []
    }
}