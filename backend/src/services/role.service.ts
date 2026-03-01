import { Role } from '../models'

export class RoleService {
  public async canDo(id_role: number, context: string, action: string): Promise<boolean> {
    const role = await Role.findByPk(id_role)
    if (!role) return false

    const permissions = Array.isArray(role.permissions) ? role.permissions : []

    for (const perm of permissions) {
      if (perm === '*') return true // Admin
      const [permContext, permAction] = perm.split('.')

      if (permContext === context && (permAction === action || permAction === '*')) {
        return true
      }
    }

    return false
  }
}

export const roleService = new RoleService()
