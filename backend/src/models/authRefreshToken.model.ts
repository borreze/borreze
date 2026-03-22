import { DataTypes, Model, Sequelize } from 'sequelize'
import { AuthRefreshTokenAttributes } from '../types/models/authRefreshToken.types'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const AUTH_REFRESH_TOKEN_CONSTRAINTS = {
    id: {
        nicename: 'ID',
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    token: {
        nicename: 'Token',
        type: DataTypes.TEXT,
        required: true,
    },
    user_id: {
        nicename: 'Utilisateur',
        type: DataTypes.INTEGER,
        required: true
    },
    expires_at: {
        nicename: 'Date d\'expiration',
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
} as const satisfies ModelConstraints<AuthRefreshTokenAttributes>

export class AuthRefreshToken extends Model<AuthRefreshTokenAttributes> implements AuthRefreshTokenAttributes {
    public id!: number
    public token!: string
    public user_id!: number
    public expires_at!: Date
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initAuthRefreshTokenModel(sequelize: Sequelize) {
    AuthRefreshToken.init(modelBuild(AUTH_REFRESH_TOKEN_CONSTRAINTS), {
        sequelize,
        tableName: 'refresh_token',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['user_id'] },
        ]
    })
}
