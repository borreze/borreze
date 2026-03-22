import { DataTypes, Model, Sequelize } from 'sequelize'
import { PageAttributeAttributes, PageAttributeAttributesCreation } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const PAGE_ATTRIBUTE_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  page_id: {
    nicename: 'Page',
    type: DataTypes.INTEGER,
    required: true
  },
  key: {
    nicename: 'Clé',
    type: DataTypes.STRING,
    maxLength: 100,
    required: true,
    unique: true,
    searchable: true
  },
  value: {
    nicename: 'Valeur',
    type: DataTypes.TEXT,
    required: false
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
} as const satisfies ModelConstraints<PageAttributeAttributes>

export class PageAttribute extends Model<PageAttributeAttributes, PageAttributeAttributesCreation> implements PageAttributeAttributes {
  public id!: number
  public page_id!: number
  public key!: string
  public value?: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initPageAttributeModel(sequelize: Sequelize) {
  PageAttribute.init(modelBuild(PAGE_ATTRIBUTE_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'page_attribute',
    underscored: true,
    indexes: [
      { fields: ['key'] },
    ]
  })
}