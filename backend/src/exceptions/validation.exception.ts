import { BaseException } from './base'
import { ValidationError } from '../types/utils/validation.types'

export class ValidationException extends BaseException {
    public errors: ValidationError[]

    constructor(message = 'Validation failed', errors?: ValidationError[]) {
        super(message, 422)
        this.errors = errors ?? []
    }
}