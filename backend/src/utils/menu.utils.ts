import { hasContext, MenuAttributes, UserAttributesPublic } from "@brz/shared"

export async function filterMenusForUser(menus: MenuAttributes[], user?: UserAttributesPublic): Promise<MenuAttributes[]> {
    const filteredMenus: MenuAttributes[] = []

    for (const menu of menus) {
        if (menu.context && hasContext(user, menu.context)) {
            filteredMenus.push(menu)
        }
    }

    return filteredMenus
}