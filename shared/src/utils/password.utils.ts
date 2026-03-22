export const AUTH_PASSWORD_LEVELS: ReadonlyArray<{ min: number, label: string, color: string }> = [
    { min: 0, label: '', color: 'transparent' },
    { min: 1, label: 'Très faible', color: '#dc2626' },
    { min: 3, label: 'Faible', color: '#f97316' },
    { min: 5, label: 'Moyen', color: '#eab308' },
    { min: 7, label: 'Fort', color: '#22c55e' },
    { min: 9, label: 'Très fort', color: '#16a34a' }
]
export const AUTH_PASSWORD_RULES: ReadonlyArray<{ score: number, description: string, function: (password: string) => boolean }> = [
    { score: 2, description: '8 caractères ou plus', function(password: string) { return password.length >= 8 } },
    { score: 1, description: '12 caractères ou plus', function(password: string) { return password.length >= 12 } },
    { score: 2, description: 'au moins une majuscule', function(password: string) { return /[A-Z]/.test(password) } },
    { score: 2, description: 'au moins une minuscule', function(password: string) { return /[a-z]/.test(password) } },
    { score: 2, description: 'au moins un chiffre', function(password: string) { return /[0-9]/.test(password) } },
    { score: 1, description: 'au moins un caractère spécial', function(password: string) { return /[^A-Za-z0-9]/.test(password) } },
]
export const AUTH_PASSWORD_RULES_SCORE_MAX = AUTH_PASSWORD_RULES.reduce((max, rule) => max + rule.score, 0)

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