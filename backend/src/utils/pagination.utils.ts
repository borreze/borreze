import { PaginationException } from '../exceptions/pagination.exception'
import { Pagination, paginationDefault } from '@brz/shared'

export function paginationValidate(page?: number, limit?: number, count?: number): void {
    if (limit && limit > 100) throw new PaginationException('limit cannot exceed 100 elements') // To prevent abuse
    if (limit && limit < 1) throw new PaginationException('Limit must be greater than 0')
    if (page && page < 1) throw new PaginationException('Page must be greater than 0')
    if (count && limit && page && Math.ceil(count / limit) < page) throw new PaginationException('Page exceeds total pages')
}

export function paginate(page: number, limit: number, count: number): Pagination {
    paginationValidate(page, limit, count)

    if (count === 0) return paginationDefault()

    const total: number = Math.ceil(count / limit)
    const offset: number = (page - 1) * limit
    const pagination: Pagination = { page, limit, total, offset, count }

    return pagination
}