import { DataTypes, ModelAttributeColumnOptions } from 'sequelize'

export interface ModelFieldConstraint extends Omit<ModelAttributeColumnOptions, 'type'> {
    type: (typeof DataTypes)[keyof typeof DataTypes] | ReturnType<typeof DataTypes.ENUM>
    maxLength?: number
    minLength?: number
    min?: number
    max?: number
    enum?: readonly string[]
    searchable?: boolean
    required?: boolean
    sensitive?: boolean
    default?: unknown
    pattern?: RegExp
}

export type ModelConstraints<T> = Partial<Record<keyof T, ModelFieldConstraint>>