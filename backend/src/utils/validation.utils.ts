import { ModelFieldConstraint, ModelConstraints } from '../types/utils/model.types'
import { ValidationError, ValidationResult } from '@brz/shared'

function validateField(field: string, value: unknown, constraint: ModelFieldConstraint): ValidationError[] {
    const errors: ValidationError[] = []

    const nicename = constraint.nicename || field

    if (constraint.required && (value === null || value === undefined || value === '')) {
        errors.push({ field, message: `Le champ '${nicename}' est requis` })
        return errors // inutile de continuer si absent
    }

    if (value === null || value === undefined) return errors

    if (typeof value === 'string') {
        if (constraint.maxLength && value.length > constraint.maxLength) {
            errors.push({ field, message: `Le champ '${nicename}' ne doit pas dépasser ${constraint.maxLength} caractères` })
        }
        if (constraint.minLength && value.length < constraint.minLength) {
            errors.push({ field, message: `Le champ '${nicename}' doit contenir au moins ${constraint.minLength} caractères` })
        }
        if (constraint.pattern && !constraint.pattern.test(value)) {
            errors.push({ field, message: `Le champ '${nicename}' format est invalide` })
        }
    }

    if (typeof value === 'number') {
        if (constraint.max !== undefined && value > constraint.max) {
            errors.push({ field, message: `Le champ '${nicename}' ne doit pas dépasser ${constraint.max}` })
        }
        if (constraint.min !== undefined && value < constraint.min) {
            errors.push({ field, message: `Le champ '${nicename}' doit être au moins ${constraint.min}` })
        }
    }

    if (constraint.enum && !constraint.enum.includes(value as string)) {
        errors.push({ field, message: `Le champ '${nicename}' doit être l'un des suivants : ${constraint.enum.join(', ')}` })
    }

    return errors
}

export function validateAll<T extends Record<string, unknown>>(
    data: T,
    constraints: ModelConstraints<T>,
    bypasses: (keyof T)[] = []
): ValidationResult {
    const errors: ValidationError[] = Object.entries(constraints).flatMap(([field, constraint]) => {
        const BYPASSES = ['created_at', 'updated_at', ...bypasses] // champs gérés automatiquement par Sequelize + customs, on les ignore dans la validation
        if (BYPASSES.includes(field)) return []

        return validateField(field, data[field], constraint as ModelFieldConstraint)
    })

    return { valid: errors.length === 0, errors }
}

export function validateOne<T extends Record<string, unknown>>(
    field: keyof T,
    value: unknown,
    constraints: ModelConstraints<T>
): ValidationResult {
    const constraint = constraints[field] as ModelFieldConstraint
    const errors = validateField(field as string, value, constraint)

    return { valid: errors.length === 0, errors }
}