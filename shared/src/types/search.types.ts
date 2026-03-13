export interface SearchResultNames {
    nice: string
    name: string
    type: 'model' | 'page' | string
}

export interface SearchResultLinks {
    self_front: string
    self_api: string
    list_front: string
    list_api: string
}
export interface SearchResult {
    title: string
    _links: SearchResultLinks
    _names: SearchResultNames
}
