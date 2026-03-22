import { DataTypes, Model, Sequelize } from 'sequelize'
import { LOG_LEVELS_KEYS, LogAttributes, LogAttributesCreation, LogLevel } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const LOG_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  level: {
    nicename: 'Niveau',
    type: DataTypes.ENUM(...LOG_LEVELS_KEYS),
    enum: LOG_LEVELS_KEYS,
    defaultValue: 'info',
    required: true
  },
  message: {
    nicename: 'Message',
    type: DataTypes.TEXT,
    required: true,
    searchable: true
  },
  data: {
    nicename: 'Données supplémentaires',
    type: DataTypes.JSONB,
    required: false,
    searchable: true
  },
  user_id: {
    nicename: 'Utilisateur',
    type: DataTypes.INTEGER,
    required: false
  },
  ip_address: {
    nicename: 'Adresse IP',
    type: DataTypes.STRING,
    maxLength: 45, // max length for IPv6 addresses
    required: false,
    searchable: true,
    pattern: /^(?:(?:\d{1,3}\.){3}\d{1,3}|[a-fA-F0-9:]+)$/
  },
  user_agent: {
    nicename: 'User Agent',
    type: DataTypes.STRING,
    maxLength: 512,
    required: false,
    searchable: true
  },
  created_at: {
    nicename: 'Date de création',
    type: DataTypes.DATE,
    required: true,
  },
} as const satisfies ModelConstraints<LogAttributes>

export class Log extends Model<LogAttributes, LogAttributesCreation> implements LogAttributes {
  public id!: number
  public level!: LogLevel
  public message!: string
  public data?: object
  public user_id?: number
  public ip_address?: string
  public user_agent?: string
  public readonly created_at!: Date
}

export function initLogModel(sequelize: Sequelize) {
  Log.init(modelBuild(LOG_CONSTRAINTS), {
    sequelize,
    timestamps: false, // we manage created_at manually, no need for updated_at
    tableName: 'brz_log', // cant use `log` as table name, it's a reserved keyword in PG
    underscored: true,
    indexes: [
      { fields: ['created_at'] },
    ]
  })
}