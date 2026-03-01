import { DataTypes, Model, Sequelize } from 'sequelize'
import { MenuAttributes, MenuAttributesCreation } from '../types/models/menu.types'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const MENU_CONSTRAINTS = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
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
  public label!: string
  public url?: string
  public parent_id?: number
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
    ]
  })
}