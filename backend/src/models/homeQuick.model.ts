import { DataTypes, Model, Sequelize } from 'sequelize'
import { HomeQuickAttributes, HomeQuickAttributesCreation } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const HOME_QUICK_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    nicename: 'Titre',
    type: DataTypes.STRING,
    maxLength: 100,
    required: true,
    searchable: true
  },
  url: {
    nicename: 'URL',
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
    description: {
    nicename: 'Description',
    type: DataTypes.STRING,
    maxLength: 500,
    required: false,
    searchable: true
  },
  icon: {
    nicename: 'Icône',
    type: DataTypes.STRING,
    maxLength: 100,
    required: true
  },
  order: {
    nicename: 'Ordre',
    type: DataTypes.INTEGER,
    required: true,
    defaultValue: 0,
    min: 0
  },
  is_visible: {
    nicename: 'Visible',
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
} as const satisfies ModelConstraints<HomeQuickAttributes>

export class HomeQuick extends Model<HomeQuickAttributes, HomeQuickAttributesCreation> implements HomeQuickAttributes {
  public id!: number
  public title!: string
  public url!: string
  public description?: string | null
  public icon!: string
  public order!: number
  public is_visible!: boolean
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initHomeQuickModel(sequelize: Sequelize) {
  HomeQuick.init(modelBuild(HOME_QUICK_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'home_quick',
    underscored: true,
    indexes: [
      { fields: ['is_visible'] }
    ]
  })
}