import { buildUrl } from '@brz/shared'
import { ModelFieldConstraint, ModelConstraints } from '../types/utils/model.types'
import { Op, WhereOptions, ModelAttributes, ModelAttributeColumnOptions, Model, ModelStatic } from 'sequelize'

// This function merges multiple WhereOptions objects into one, combining them with AND logic
// Mainly used to avoid having `Expression produces a union type that is too complex to represent.ts(2590)`
export function modelBuildWhere(parts: WhereOptions[]): WhereOptions { 
    return Object.assign({}, ...parts) as WhereOptions
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

export function modelBuildUrl(template: string | null, data: Model | Record<string, unknown>): string {
    const plain = data instanceof Model ? data.get({ plain: true }) : data
    return buildUrl(template, plain)
}

export async function isUnique(model: ModelStatic<Model>, field: string, value: unknown, options?: { excludeId?: number | null }): Promise<boolean> {
    const where: WhereOptions = { [field]: value }

    if (options?.excludeId) {
        where.id = { [Op.ne]: options.excludeId }
    }

    const count = await model.count({ where })
    return count === 0
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