import { DataTypes, Model, Sequelize } from 'sequelize'
import { SettingAttributes, SettingAttributesCreation } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const SETTING_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    nicename: 'Clé',
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    unique: true,
    searchable: true
  },
  value: {
    nicename: 'Valeur',
    type: DataTypes.TEXT,
    required: false,
    searchable: true
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
} as const satisfies ModelConstraints<SettingAttributes>

export class Setting extends Model<SettingAttributes, SettingAttributesCreation> implements SettingAttributes {
  public id!: number
  public key!: string
  public value?: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initSettingModel(sequelize: Sequelize) {
  Setting.init(modelBuild(SETTING_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'setting',
    underscored: true,
    indexes: [
      { fields: ['key'] },
    ]
  })
}