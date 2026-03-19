import { DataTypes, Model, Sequelize } from 'sequelize'
import { SchoolHolidayAttributes, SchoolHolidayAttributesCreation, SchoolYear } from '@brz/shared'
import { modelBuild } from '../utils/model.utils'
import { ModelConstraints } from '../types/utils/model.types'

export const SCHOOL_HOLIDAY_CONSTRAINTS = {
    id: {
        nicename: 'ID',
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        nicename: 'Nom',
        type: DataTypes.STRING,
        maxLength: 255,
        required: true,
        searchable: true
    },
    year: {
        nicename: 'Année scolaire',
        type: DataTypes.STRING,
        maxLength: 9,
        required: true,
        searchable: true
    },
    date_start: {
        nicename: 'Date de début',
        type: DataTypes.DATE,
        required: true
    },
    date_end: {
        nicename: 'Date de fin',
        type: DataTypes.DATE,
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
} as const satisfies ModelConstraints<SchoolHolidayAttributes>

export class SchoolHoliday extends Model<SchoolHolidayAttributes, SchoolHolidayAttributesCreation> implements SchoolHolidayAttributes {
    public id!: number
    public name!: string
    public year!: SchoolYear
    public date_start!: Date
    public date_end!: Date
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initSchoolHolidayModel(sequelize: Sequelize) {
    SchoolHoliday.init(modelBuild(SCHOOL_HOLIDAY_CONSTRAINTS), {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        tableName: 'school_holiday',
        underscored: true,
        indexes: [
            { fields: ['name'] },
        ]
    })
}