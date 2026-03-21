import { MenuAttributes, UserAttributesPublic } from "@brz/shared"
import { getPermsContexts, isAdmin } from "./auth.utils"

export async function filterMenusByPermissions(menus: MenuAttributes[], user?: UserAttributesPublic): Promise<MenuAttributes[]> {
    if (!user) return [] // No user, no menus

    const filteredMenus: MenuAttributes[] = []

    // Admin
    if (isAdmin(user)) return menus

    // Regular user
    const permContexts = getPermsContexts(user)
    for (const menu of menus) {
        if (menu.context && permContexts.includes(menu.context)) {
            filteredMenus.push(menu)
        }
    }

    return filteredMenus
}