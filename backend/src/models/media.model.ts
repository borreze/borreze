import { DataTypes, Model, Sequelize } from 'sequelize'
import { MEDIA_TYPES, MediaAttributes, MediaAttributesCreation, MediaType } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'


export const MEDIA_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  file_name: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  file_path: {
    type: DataTypes.STRING,
    maxLength: 500,
    required: true,
    searchable: true
  },
  type: {
    type: DataTypes.ENUM(...MEDIA_TYPES),
    enum: MEDIA_TYPES,
    required: true
  },
  mime_type: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: true
  },
  size: {
    type: DataTypes.INTEGER,
    required: true
  },
  folder: {
    type: DataTypes.STRING,
    maxLength: 512,
    required: false
  },
  uploaded_by: {
    type: DataTypes.BIGINT,
    required: false
  },
  created_at: {
    type: DataTypes.DATE,
    required: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    required: true,
  }
} as const satisfies ModelConstraints<MediaAttributes>

export class Media extends Model<MediaAttributes, MediaAttributesCreation> implements MediaAttributes {
  public id!: number
  public file_name!: string
  public file_path!: string
  public type!: MediaType
  public mime_type!: string
  public size!: number
  public folder?: string
  public uploaded_by?: number
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initMediaModel(sequelize: Sequelize) {
  Media.init(modelBuild(MEDIA_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'media',
    underscored: true,
    indexes: [
      { fields: ['file_path'] },
    ]
  })
}