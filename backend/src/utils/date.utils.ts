import { SchoolYear } from "@brz/shared"

export function currentSchoolYear(monthSwitch: number = 8): SchoolYear {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    if (month >= monthSwitch) return `${year}-${year + 1}`
    return `${year - 1}-${year}`
}