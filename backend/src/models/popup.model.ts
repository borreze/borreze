import { DataTypes, Model, Sequelize } from 'sequelize'
import { PopupAttributes, PopupAttributesCreation } from '@brz/shared'
import { Media } from './media.model'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const POPUP_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  media_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  date_from: {
    type: DataTypes.DATE,
    required: false
  },
  date_to: {
    type: DataTypes.DATE,
    required: false
  },
  title: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  content: {
    type: DataTypes.TEXT,
    required: false,
    searchable: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    required: true,
    defaultValue: false
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
} as const satisfies ModelConstraints<PopupAttributes>

export const POST_INCLUDE_DEFAULTS = [
  { model: Media, as: 'media' },
]

export class Popup extends Model<PopupAttributes, PopupAttributesCreation> implements PopupAttributes {
  public id!: number
  public media_id?: number
  public date_from?: Date
  public date_to?: Date
  public title!: string
  public content?: string
  public is_active!: boolean
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initPopupModel(sequelize: Sequelize) {
  Popup.init(modelBuild(POPUP_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'popup',
    indexes: [
      { fields: ['date_from'] },
    ]
  })
}