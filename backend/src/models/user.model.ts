import { DataTypes, Model, Sequelize } from 'sequelize'
import { USER_ROLE_ID_DEFAULT, USER_STATUSES_KEYS, UserAttributes, UserAttributesCreation, UserStatus } from '@brz/shared'
import { Role } from './role.model'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const USER_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    nicename: 'Email',
    unique: true,
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  password: {
    nicename: 'Mot de passe',
    type: DataTypes.STRING,
    maxLength: 255,
    required: true
  },
  username: {
    nicename: 'Nom',
    unique: true,
    type: DataTypes.STRING,
    maxLength: 50,
    required: true,
    searchable: true
  },
  first_name: {
    nicename: 'Nom',
    type: DataTypes.STRING,
    maxLength: 100,
    required: false,
    searchable: true
  },
  last_name: {
    nicename: 'Nom',
    type: DataTypes.STRING,
    maxLength: 100,
    required: false,
    searchable: true
  },
  role_id: {
    nicename: 'Rôle',
    type: DataTypes.INTEGER,
    required: true,
    defaultValue: USER_ROLE_ID_DEFAULT,
  },
  status: {
    nicename: 'Statut',
    type: DataTypes.ENUM(...USER_STATUSES_KEYS),
    enum: USER_STATUSES_KEYS,
    defaultValue: 'active',
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
} as const satisfies ModelConstraints<UserAttributes>

export class User extends Model<UserAttributes, UserAttributesCreation> implements UserAttributes {
  public id!: number
  public email!: string
  public password!: string
  public username!: string
  public first_name?: string
  public last_name?: string
  public status!: UserStatus
  public role_id!: number
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export const USER_INCLUDE_DEFAULTS = [
  { model: Role, as: 'role' }
]

export function initUserModel(sequelize: Sequelize) {
  User.init(modelBuild(USER_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'user',
    underscored: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['username'] },
    ]
  })
}