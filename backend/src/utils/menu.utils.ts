import { MenuAttributes, UserAttributesPublic } from "@brz/shared"
import { Role } from '../models'

export async function filterMenusByPermissions(menus: MenuAttributes[], user?: UserAttributesPublic): Promise<MenuAttributes[]> {
    if (!user) return [] // No user, no menus

    const role = await Role.findByPk(user?.role_id)
    if (!role) return []
    const permissions = Array.isArray(role.permissions) ? role.permissions : []

    const filteredMenus: MenuAttributes[] = []

    // Admin
    for (const perm of permissions) {
        if (perm === '*') return menus
    }

    // Regular user
    const permContexts = permissions
        .filter(perm => perm !== '*')
        .map(perm => perm.split('.')[0]) // Get context part of permission


    for (const menu of menus) {
        if (permContexts.includes(menu.context)) {
            filteredMenus.push(menu)
        }
    }

    return filteredMenus
}