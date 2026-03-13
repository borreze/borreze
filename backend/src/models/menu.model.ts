import { DataTypes, Model, Sequelize } from 'sequelize'
import { MENU_CONTEXTS, MenuAttributes, MenuAttributesCreation, MenuContext } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'


export const MENU_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  context: {
    type: DataTypes.ENUM(...MENU_CONTEXTS),
    enum: MENU_CONTEXTS,
    required: true,
  },
  label: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  url: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    searchable: true
  },
  parent_id: {
    type: DataTypes.BIGINT,
    required: false
  },
  icon: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: true
  },
  order: {
    type: DataTypes.INTEGER,
    required: true,
    defaultValue: 0,
    min: 0
  },
  is_visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    required: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    required: true,
  }
} as const satisfies ModelConstraints<MenuAttributes>

export class Menu extends Model<MenuAttributes, MenuAttributesCreation> implements MenuAttributes {
  public id!: number
  public context!: MenuContext
  public label!: string
  public url?: string
  public parent_id?: number
  public icon?: string
  public order!: number
  public is_visible!: boolean
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

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
      { fields: ['context'] },
    ]
  })
}