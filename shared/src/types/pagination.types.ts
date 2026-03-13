export interface Pagination {
    page: number,
    limit: number,
    total?: number | undefined,
    offset?: number | undefined,
    count?: number | undefined
}