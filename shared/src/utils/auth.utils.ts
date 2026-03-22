import { UserAttributesAuth, UserAttributesPublic } from "../types/user.types"

export function isAdmin(user: UserAttributesPublic | UserAttributesAuth | null | undefined): boolean {
    if (!user) return false

    for (const perm of user.permissions) {
        if (perm === '*') return true // Admin
    }

    return false
}

export function getPermsContexts(user: UserAttributesPublic | UserAttributesAuth | null | undefined): string[] {
    if (!user) return []

    const permContexts = user.permissions
        .filter(perm => perm !== '*')
        .map(perm => perm.split('.')[0]) // Get context part of permission

    return Array.from(new Set(permContexts)) // Unique contexts
}

export function getPerms(user: UserAttributesPublic | UserAttributesAuth | null | undefined): string[] {
    if (!user) return []

    const perms = user.permissions
        .filter(perm => perm !== '*')

    return Array.from(new Set(perms)) // Unique permissions
}

export function canDo(user: UserAttributesPublic | UserAttributesAuth | null | undefined, context: string, action: string): boolean {
    if (!user) return false

    if (isAdmin(user)) return true

    const perms = getPerms(user)
    for (const perm of perms) {
        const [permContext, permAction] = perm.split('.')

        if (permContext === context && (permAction === action || permAction === '*')) {
            return true
        }
    }

    return false
}