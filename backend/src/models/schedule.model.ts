import { DataTypes, Model, Sequelize } from 'sequelize'
import { SCHEDULE_DAYS_KEYS, SCHEDULE_TYPES_KEYS, ScheduleAttributes, ScheduleAttributesCreation, ScheduleDay, ScheduleType, TimeInterval } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const SCHEDULE_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    nicename: 'Type',
    type: DataTypes.ENUM(...SCHEDULE_TYPES_KEYS),
    enum: SCHEDULE_TYPES_KEYS,
    required: true
  },
  post_id: {
    nicename: 'Post',
    type: DataTypes.INTEGER,
    required: false
  },
  day: {
    nicename: 'Jour',
    type: DataTypes.ENUM(...SCHEDULE_DAYS_KEYS),
    enum: SCHEDULE_DAYS_KEYS,
    required: true
  },
  intervals: {
    nicename: 'Plages horaires',
    type: DataTypes.JSONB,
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
} as const satisfies ModelConstraints<ScheduleAttributes>

export class Schedule extends Model<ScheduleAttributes, ScheduleAttributesCreation> implements ScheduleAttributes {
  public id!: number
  public type!: ScheduleType
  public post_id?: number
  public day!: ScheduleDay
  public intervals!: TimeInterval[]
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initScheduleModel(sequelize: Sequelize) {
  Schedule.init(modelBuild(SCHEDULE_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'schedule',
    underscored: true,
    indexes: [
      { fields: ['type'] },
    ]
  })
}