import { DataTypes, Model, Sequelize } from 'sequelize'
import { RoleAttributes, RoleAttributesCreation } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const ROLE_CONSTRAINTS = {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        maxLength: 100,
        required: true,
        searchable: true
    },
    permissions: {
        type: DataTypes.JSON,
        required: false
    },
    created_at: {
        type: DataTypes.DATE,
        required: true
    },
    updated_at: {
        type: DataTypes.DATE,
        required: true
    }
} as const satisfies ModelConstraints<RoleAttributes>

export class Role extends Model<RoleAttributes, RoleAttributesCreation> implements RoleAttributes {
    public id!: number
    public name!: string
    public permissions?: object
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initRoleModel(sequelize: Sequelize) {
    Role.init(modelBuild(ROLE_CONSTRAINTS), {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        tableName: 'role',
        underscored: true,
    })
}