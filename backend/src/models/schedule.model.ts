import { DataTypes, Model, Sequelize } from 'sequelize'
import { SCHEDULE_DAYS_KEYS, SCHEDULE_TYPES_KEYS, ScheduleAttributes, ScheduleAttributesCreation, ScheduleDay, ScheduleType, TimeInterval } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'



export const SCHEDULE_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM(...SCHEDULE_TYPES_KEYS),
    enum: SCHEDULE_TYPES_KEYS,
    required: true
  },
  commerce_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  day: {
    type: DataTypes.ENUM(...SCHEDULE_DAYS_KEYS),
    enum: SCHEDULE_DAYS_KEYS,
    required: true
  },
  intervals: {
    type: DataTypes.JSONB,
    required: true
  },
  created_at: {
    type: DataTypes.DATE,
    required: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    required: true,
  }
} as const satisfies ModelConstraints<ScheduleAttributes>

export class Schedule extends Model<ScheduleAttributes, ScheduleAttributesCreation> implements ScheduleAttributes {
  public id!: number
  public type!: ScheduleType
  public commerce_id?: number
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