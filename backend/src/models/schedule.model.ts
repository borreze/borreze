import { DataTypes, Model, Sequelize } from 'sequelize'
import { ScheduleAttributes, ScheduleAttributesCreation, ScheduleDay, ScheduleType, TimeInterval } from '../types/models/schedule.types'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const SCHEDULE_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
export const SCHEDULE_TYPES = ['town_hall', 'commerce', 'school_childcare'] as const

export const SCHEDULE_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM(...SCHEDULE_TYPES),
    enum: SCHEDULE_TYPES,
    required: true
  },
  commerce_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  day: {
    type: DataTypes.ENUM(...SCHEDULE_DAYS),
    enum: SCHEDULE_DAYS,
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