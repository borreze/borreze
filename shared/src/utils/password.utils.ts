import { AUTH_PASSWORD_LEVELS, AUTH_PASSWORD_RULES } from "../types/password.types"

export function passwordGetLevel(score: number) {
    for (let i = AUTH_PASSWORD_LEVELS.length - 1; i >= 0; i--) {
        if (score >= AUTH_PASSWORD_LEVELS[i].min) return AUTH_PASSWORD_LEVELS[i]
    }

    return AUTH_PASSWORD_LEVELS[0]
}

export function passwordGetScore(password: string): number {
    if (!password) return 0

    let score = 0
    for (const rule of AUTH_PASSWORD_RULES) {
        if (rule.function(password)) {
            score += rule.score
        }
    }

    return score
}

export function passwordGetMissing(password: string): string[] {
    if (!password) return AUTH_PASSWORD_RULES.map(rule => rule.description)

    const missing: string[] = []
    for (const rule of AUTH_PASSWORD_RULES) {
        if (!rule.function(password)) {
            missing.push(rule.description)
        }
    }

    return missing
}