import { BaseException } from './base'
import { ValidationError } from '../types/utils/validation.types'

export class ValidationException extends BaseException {
    public errors: ValidationError[]

    constructor(errors: ValidationError[]) {
        super('Validation failed', 422)
        this.errors = errors
    }
}