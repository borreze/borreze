export interface User {
    id: number
    email: string
    username: string
    first_name?: string
    last_name?: string
    role_id: number,
    status: string
}