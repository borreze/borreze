import { ValidationError } from 'sequelize'
import { Pagination } from '@brz/shared'

export interface Return {
    message?: string | null
    timestamp?: string | null
    error?: ValidationError[] | null
    data?: Array<object> | object | boolean | null
    pagination?: Pagination | null
}