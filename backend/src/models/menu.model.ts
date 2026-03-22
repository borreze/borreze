import { DataTypes, Model, Sequelize } from 'sequelize'
import {  MenuAttributes, MenuAttributesCreation } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'
import { MENU_SCOPES_KEYS, MenuScope } from '@brz/shared'

export const MENU_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  scope: {
    nicename: 'Scope',
    type: DataTypes.ENUM(...MENU_SCOPES_KEYS),
    enum: MENU_SCOPES_KEYS,
    required: true,
  },
  context: {
    nicename: 'Contexte',
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
  },
  label: {
    nicename: 'Libellé',
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  url: {
    nicename: 'URL',
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  parent_id: {
    nicename: 'Parent',
    type: DataTypes.INTEGER,
    required: false
  },
  icon: {
    nicename: 'Icône',
    type: DataTypes.STRING,
    maxLength: 100,
    required: false
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
} as const satisfies ModelConstraints<MenuAttributes>

export class Menu extends Model<MenuAttributes, MenuAttributesCreation> implements MenuAttributes {
  public id!: number
  public scope!: MenuScope
  public context?: string
  public label!: string
  public url?: string
  public parent_id?: number
  public icon?: string
  public order!: number
  public is_visible!: boolean
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export const MENU_INCLUDE_DEFAULTS = [
  { model: Menu, as: 'children' }
]

export function initMenuModel(sequelize: Sequelize) {
  Menu.init(modelBuild(MENU_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'menu',
    underscored: true,
    indexes: [
      { fields: ['parent_id'] },
      { fields: ['scope'] },
      { fields: ['context'] },
    ]
  })
}