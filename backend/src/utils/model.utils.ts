import { ModelFieldConstraint, ModelConstraints } from '../types/utils/model.types'
import { SearchResultLinks, SearchResultNames } from '@brz/shared'
import { Op, WhereOptions, ModelAttributes, ModelAttributeColumnOptions, Model, ModelStatic } from 'sequelize'

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

export async function isUnique(model: ModelStatic<Model>, field: string, value: unknown, options?: { excludeId?: number | null }): Promise<boolean> {
    const where: WhereOptions = { [field]: value }

    if (options?.excludeId) {
        where.id = { [Op.ne]: options.excludeId }
    }

    const count = await model.count({ where })
    return count === 0
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