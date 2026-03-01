import { Request } from 'express'
import { Order } from '../types/utils/request.types'
import { BadRequest } from '../exceptions/request.exception'

const DEFAULT_ORDER: Order[] = [['created_at', 'DESC'], ['id', 'DESC']]

// Take an array of string and return an array of int
export const parseArrayInteger = (input: string | string[] | undefined): number[] => {
    if (!input) return []

    const strArray = Array.isArray(input) ? input : [input]
    const intArray: number[] = []

    for (const str of strArray) {
        const num = parseInt(str, 10)
        if (!isNaN(num)) {
            intArray.push(num)
        } else {
            throw new BadRequest(`Invalid integer value: ${str}`)
        }
    }

    return intArray
}

export const parseOrder = (req?: Request): Order[] => {
    if (!req) return DEFAULT_ORDER

    const orderParam = req.query?.order

    if (!orderParam) {
        return DEFAULT_ORDER
    }

    try {
        let parsed: unknown

        // Handle both JSON and colon-based syntax (e.g., "name:asc")
        if (typeof orderParam === 'string' && !orderParam.trim().startsWith('[')) {
            // Example: sort=name:asc,id:desc
            parsed = orderParam.split(',').map((pair) => {
                const [field, dir] = pair.split(':').map((s) => s.trim())
                return [field, (dir || 'ASC').toUpperCase()] as [string, string]
            })
        } else {
            // Example: sort=[["name","asc"],["id","desc"]]
            parsed = JSON.parse(orderParam.toString())
        }

        if (Array.isArray(parsed)) {
            const cleaned: Order[] = []

            for (const item of parsed) {
                if (Array.isArray(item) && item.length === 2) {
                    const [field, dir] = item
                    if (
                        typeof field === 'string' &&
                        typeof dir === 'string' &&
                        ['ASC', 'DESC'].includes(dir.toUpperCase())
                    ) {
                        cleaned.push([field, dir.toUpperCase() as 'ASC' | 'DESC'])
                    }
                }
            }

            if (cleaned.length > 0) {
                return cleaned
            }
        }
    } catch (error) {
        throw new BadRequest((error as Error).message ?? 'Order parsing error')
    }

    return DEFAULT_ORDER
}

