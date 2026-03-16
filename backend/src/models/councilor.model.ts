import { DataTypes, Model, Sequelize } from 'sequelize'
import { CouncilorAttributes, CouncilorAttributesCreation } from '@brz/shared'
import { Media } from './media.model'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const COUNCILOR_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING,
    maxLength: 50,
    required: true,
    searchable: true
  },
  last_name: {
    type: DataTypes.STRING,
    maxLength: 50,
    required: true,
    searchable: true
  },
  birth_date: {
    type: DataTypes.DATE,
    required: false
  },
  appointment_date: {
    type: DataTypes.DATE,
    required: true
  },
  position: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: true,
    searchable: true
  },
  picture_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  email: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  phone: {
    type: DataTypes.STRING,
    maxLength: 11, // Format: +1234567890
    required: false,
    searchable: true,
    pattern: /^\+?\d{10,11}$/
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
} as const satisfies ModelConstraints<CouncilorAttributes>

export const COUNCILOR_INCLUDE_DEFAULTS = [
  { model: Media, as: 'picture' }
]

export class Councilor extends Model<CouncilorAttributes, CouncilorAttributesCreation> implements CouncilorAttributes {
  public id!: number
  public first_name!: string
  public last_name!: string
  public birth_date?: Date
  public appointment_date!: Date
  public position!: string
  public picture_id?: number
  public email?: string
  public phone?: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initCouncilorModel(sequelize: Sequelize) {
  Councilor.init(modelBuild(COUNCILOR_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'councilor',
    underscored: true
  })
}