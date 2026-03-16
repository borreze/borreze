import { PaginationException } from '../exceptions/pagination.exception'
import { Pagination, paginationDefault, UserAttributesPublic } from '@brz/shared'
import { userCheck } from './auth.utils'

export function paginationValidate(page?: number, limit?: number, count?: number, user?: UserAttributesPublic): void {
    const LIMIT_MAX_FO = 100
    const LIMIT_MAX_BO = 1000

    const isLoggedIn = user && userCheck(user)

    // To prevent abuse. Logged in users do have a higher limit to allow for more efficient back-office management, but it should still be capped to prevent abuse.
    if (limit && (
        (!isLoggedIn && limit > LIMIT_MAX_FO) ||
        (isLoggedIn && limit > LIMIT_MAX_BO)
    )) throw new PaginationException('Limit exceeds maximum allowed value')
    if (limit && limit < 1) throw new PaginationException('Limit must be greater than 0')
    if (page && page < 1) throw new PaginationException('Page must be greater than 0')
    if (count && limit && page && Math.ceil(count / limit) < page) throw new PaginationException('Page exceeds total pages')
}

export function paginate(page: number, limit: number, count: number, user?: UserAttributesPublic): Pagination {
    const pagDefault = paginationDefault()
    if (!page) page = pagDefault.page
    if (!limit) limit = pagDefault.limit
    if (!count) count = 0

    paginationValidate(page, limit, count, user)

    const total: number = Math.ceil(count / limit)
    const offset: number = (page - 1) * limit
    const pagination: Pagination = { page, limit, total, offset, count }

    return pagination
}