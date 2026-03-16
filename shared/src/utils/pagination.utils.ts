import { Pagination } from "../types/pagination.types";

export function paginationDefault(): Pagination {
    return { page: 1, limit: 12, total: 0, offset: 0 } // 12 is a nice number for grids (can be divided by 2, 3, 4, 6)
}