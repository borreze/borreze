import { DataTypes, Model, Sequelize } from 'sequelize'
import { SchoolMealAttributes, SchoolMealAttributesCreation } from '@brz/shared'
import { Media } from './media.model'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const SCHOOL_MEAL_CONSTRAINTS = {
    id: {
        nicename: 'ID',
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    date_start: {
        nicename: 'Date de début',
        type: DataTypes.DATE,
        required: true
    },
    menu_data: {
        nicename: 'Menu',
        type: DataTypes.JSONB,
        required: true
    },
    pdf_id: {
        nicename: 'PDF',
        type: DataTypes.BIGINT,
        required: false
    },
    is_archived: {
        nicename: 'Archivé',
        type: DataTypes.BOOLEAN,
        required: true
    },
    created_at: {
        nicename: 'Date de création',
        type: DataTypes.DATE,
        required: true,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        nicename: 'Date de mise à jour',
        type: DataTypes.DATE,
        required: true,
        defaultValue: DataTypes.NOW
    }
} as const satisfies ModelConstraints<SchoolMealAttributes>

export class SchoolMeal extends Model<SchoolMealAttributes, SchoolMealAttributesCreation> implements SchoolMealAttributes {
    public id!: number
    public date_start!: Date
    public menu_data!: object
    public pdf_id?: number
    public is_archived!: boolean
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export const SCHOOL_MEAL_INCLUDE_DEFAULTS = [
    { model: Media, as: 'pdf' }
]

export function initSchoolMealModel(sequelize: Sequelize) {
    SchoolMeal.init(modelBuild(SCHOOL_MEAL_CONSTRAINTS), {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        tableName: 'school_meal',
        underscored: true,
        indexes: [
            { fields: ['date_start'] },
            { fields: ['is_archived'] }
        ]
    })
}