import { DataTypes, Model, Sequelize } from 'sequelize'
import { USER_STATUSES, UserAttributes, UserAttributesCreation, UserStatus } from '../types/models/user.types'
import { Role } from './role.model'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const USER_ROLE_ID_DEFAULT = 2 // Default role for new users

export const USER_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    unique: true,
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  password: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true
  },
  username: {
    unique: true,
    type: DataTypes.STRING,
    maxLength: 50,
    required: true,
    searchable: true
  },
  first_name: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: false,
    searchable: true
  },
  last_name: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: false,
    searchable: true
  },
  email_verified_at: {
    type: DataTypes.DATE,
    required: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    required: true
  },
  status: {
    type: DataTypes.ENUM(...USER_STATUSES),
    enum: USER_STATUSES,
    defaultValue: 'active',
    required: true
  },
  created_at: {
    type: DataTypes.DATE,
    required: true
  },
  updated_at: {
    type: DataTypes.DATE,
    required: true
  }
} as const satisfies ModelConstraints<UserAttributes>

export const USER_INCLUDE_DEFAULTS = [
  { model: Role, as: 'role' }
]

export class User extends Model<UserAttributes, UserAttributesCreation> implements UserAttributes {
  public id!: number
  public email!: string
  public password!: string
  public username!: string
  public first_name?: string
  public last_name?: string
  public email_verified_at?: Date
  public status!: UserStatus
  public role_id!: number
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

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