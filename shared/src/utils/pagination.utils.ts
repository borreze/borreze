import { Pagination } from "../types/pagination.types";

export function paginationDefault(): Pagination {
    return { page: 1, limit: 10, total: 0, offset: 0 }
}