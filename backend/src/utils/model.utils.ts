import { ModelFieldConstraint, ModelConstraints } from '../types/utils/model.types'
import { SearchResultLinks, SearchResultNames } from '../types/utils/search.types'
import { ValidationError, ValidationResult } from '../types/utils/validation.types'
import { Op, WhereOptions, ModelAttributes, ModelAttributeColumnOptions, Model } from 'sequelize'

export const slugify = (text: string | null | undefined): string => {
    if (!text) return ''
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w\\-]+/g, '')  // Remove all non-word chars
        .replace(/\\-\\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')         // Trim - from start of text
        .replace(/-+$/, '')         // Trim - from end of text
}

export function modelBuild<M extends Model>(constraints: ModelConstraints<M['_attributes']>): ModelAttributes<M, M['_creationAttributes']> {
    return Object.fromEntries(
        Object.entries(constraints).map(([field, constraint]) => {
            const {
                maxLength,
                minLength,
                min,
                max,
                required,
                default: defaultValue,
                enum: enumValues,
                ...sequelizeOptions
            } = constraint as ModelFieldConstraint

            const column: ModelAttributeColumnOptions = {
                ...sequelizeOptions,
                allowNull: !required,
                ...(defaultValue !== undefined && { defaultValue }),
                validate: {
                    ...(maxLength !== undefined && { len: [minLength ?? 0, maxLength] }),
                    ...(enumValues && { isIn: [Array.from(enumValues)] }),
                    ...(min !== undefined && { min }),
                    ...(max !== undefined && { max }),
                }
            }

            return [field, column]
        })
    ) as ModelAttributes<M, M['_creationAttributes']>
}

function modelBuildLink(template: string | null, data: Model | Record<string, unknown>): string {
    if (!template) return '#'
    if (!template.includes('<') || !template.includes('>')) return template

    const plain = data instanceof Model ? data.get({ plain: true }) : data

    return template.replace(/<(\w+)>/g, (_, key) => {
        const value = (plain as Record<string, unknown>)[key]
        if (value === undefined || value === null) {
            throw new Error(`Missing value for URL placeholder: ${key}`)
        }
        return encodeURIComponent(String(value))
    })
}

export function modelAttach(data: Record<string, unknown> | Record<string, unknown>[], options?: { links?: SearchResultLinks; names?: SearchResultNames }): void {
    const { links, names } = options || {}

    const elements = Array.isArray(data) ? data : [data]

    for (const el of elements) {
        if (links) {
            el._links = {
                self_front: modelBuildLink(links.self_front || null, el),
                self_api: modelBuildLink(links.self_api || null, el),
                list_front: modelBuildLink(links.list_front || null, el),
                list_api: modelBuildLink(links.list_api || null, el),
            }
        }

        if (names) {
            el._names = {
                nice: names.nice || null,
                name: names.name || null,
                type: names.type || null,
            }
        }
    }
}

function getSearchableFields<T>(constraints: ModelConstraints<T>): string[] {
    return Object.entries(constraints)
        .filter(([, constraint]) => (constraint as ModelFieldConstraint).searchable)
        .map(([field]) => field)
}

export function searchWhere<T>(constraints: ModelConstraints<T>, search?: string | null): WhereOptions {
    if (!search || search.trim().length < 2) return {}

    const fields = getSearchableFields(constraints)
    const term = search.trim()

    return {
        [Op.or]: fields.map(field => ({ [field]: { [Op.iLike]: `%${term}%` } }))
    }
}

function validateField(field: string, value: unknown, constraint: ModelFieldConstraint): ValidationError[] {
    const errors: ValidationError[] = []

    if (constraint.required && (value === null || value === undefined || value === '')) {
        errors.push({ field, message: `${field} est requis` })
        return errors // inutile de continuer si absent
    }

    if (value === null || value === undefined) return errors

    if (typeof value === 'string') {
        if (constraint.maxLength && value.length > constraint.maxLength) {
            errors.push({ field, message: `${field} ne doit pas dépasser ${constraint.maxLength} caractères` })
        }
        if (constraint.minLength && value.length < constraint.minLength) {
            errors.push({ field, message: `${field} doit contenir au moins ${constraint.minLength} caractères` })
        }
        if (constraint.pattern && !constraint.pattern.test(value)) {
            errors.push({ field, message: `${field} format est invalide` })
        }
    }

    if (typeof value === 'number') {
        if (constraint.max !== undefined && value > constraint.max) {
            errors.push({ field, message: `${field} ne doit pas dépasser ${constraint.max}` })
        }
        if (constraint.min !== undefined && value < constraint.min) {
            errors.push({ field, message: `${field} doit être au moins ${constraint.min}` })
        }
    }

    if (constraint.enum && !constraint.enum.includes(value as string)) {
        errors.push({ field, message: `${field} doit être l'un des suivants : ${constraint.enum.join(', ')}` })
    }

    return errors
}

export function validateAll<T extends Record<string, unknown>>(
    data: T,
    constraints: ModelConstraints<T>
): ValidationResult {
    const errors: ValidationError[] = Object.entries(constraints).flatMap(([field, constraint]) =>
        validateField(field, data[field], constraint as ModelFieldConstraint)
    )

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