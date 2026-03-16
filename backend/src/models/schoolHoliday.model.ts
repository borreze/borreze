import { DataTypes, Model, Sequelize } from 'sequelize'
import { SchoolHolidayAttributes, SchoolHolidayAttributesCreation, SchoolYear } from '@brz/shared'
import { modelBuild } from '../utils/model.utils'
import { ModelConstraints } from '../types/utils/model.types'

export const SCHOOL_HOLIDAY_CONSTRAINTS = {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        maxLength: 255,
        required: true,
        searchable: true
    },
    year: {
        type: DataTypes.STRING,
        maxLength: 9,
        required: true,
        searchable: true
    },
    date_start: {
        type: DataTypes.DATE,
        required: true
    },
    date_end: {
        type: DataTypes.DATE,
        required: true
    },
    created_at: {
        type: DataTypes.DATE,
        required: true,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
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