import { DataTypes, Model, Sequelize } from 'sequelize'
import { LOG_LEVELS, LogAttributes, LogAttributesCreation, LogLevel } from '../types/models/log.types'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const LOG_RENTENTION_DAYS = 30

export const LOG_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  level: {
    type: DataTypes.ENUM(...LOG_LEVELS),
    enum: LOG_LEVELS,
    defaultValue: 'info',
    required: true
  },
  message: {
    type: DataTypes.TEXT,
    required: true,
    searchable: true
  },
  context: {
    type: DataTypes.JSONB,
    required: false,
    searchable: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  ip_address: {
    type: DataTypes.STRING,
    maxLength: 45, // max length for IPv6 addresses
    required: false,
    searchable: true,
    pattern: /^(?:(?:\d{1,3}\.){3}\d{1,3}|[a-fA-F0-9:]+)$/
  },
  user_agent: {
    type: DataTypes.STRING,
    maxLength: 512,
    required: false,
    searchable: true
  },
  created_at: {
    type: DataTypes.DATE,
    required: true,
  },
} as const satisfies ModelConstraints<LogAttributes>

export class Log extends Model<LogAttributes, LogAttributesCreation> implements LogAttributes {
  public id!: number
  public level!: LogLevel
  public message!: string
  public context?: object
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