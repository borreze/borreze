import { DataTypes, Model, Sequelize } from 'sequelize'
import { AuthPasswordResetTokenAttributes } from '../types/models/authPasswordResetToken.types'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const AUTH_PASSWORD_RESET_TOKEN_CONSTRAINTS = {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.BIGINT,
        required: true
    },
    code_hash: {
        type: DataTypes.TEXT,
        required: true
    },
    expires_at: {
        type: DataTypes.DATE,
        required: true
    },
    used: {
        type: DataTypes.BOOLEAN,
        required: true,
        defaultValue: false
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
} as const satisfies ModelConstraints<AuthPasswordResetTokenAttributes>

export class AuthPasswordResetToken extends Model<AuthPasswordResetTokenAttributes> implements AuthPasswordResetTokenAttributes {
    public id!: number
    public user_id!: number
    public code_hash!: string
    public expires_at!: Date
    public used!: boolean
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initAuthPasswordResetTokenModel(sequelize: Sequelize) {
    AuthPasswordResetToken.init(modelBuild(AUTH_PASSWORD_RESET_TOKEN_CONSTRAINTS), {
        sequelize,
        tableName: 'password_reset_token',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['user_id'] },
        ]
    })
}
