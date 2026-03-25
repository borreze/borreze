import { GLOBAL_SEARCH_LENGTH_MIN } from "../types/global.types"

export const isQueryValid = (query: string | null | undefined): boolean => {
    return !!query && query.trim().length >= GLOBAL_SEARCH_LENGTH_MIN
}