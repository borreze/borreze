import { DataTypes, Model, Sequelize } from 'sequelize'
import { PracticalInformationAttributes, PracticalInformationAttributesCreation } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { SearchResultLinks, SearchResultNames } from '@brz/shared'
import { modelBuild } from '../utils/model.utils'

export const PRACTICAL_INFORMATION_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    nicename: 'Titre',
    type: DataTypes.STRING,
    maxLength: 100,
    required: true,
    searchable: true
  },
  content: {
    nicename: 'Contenu',
    type: DataTypes.TEXT,
    required: true,
    searchable: true
  },
  order: {
    nicename: 'Ordre',
    type: DataTypes.INTEGER,
    required: true,
    defaultValue: 0,
    min: 0
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
} as const satisfies ModelConstraints<PracticalInformationAttributes>

export const PROJECT_LINKS: SearchResultLinks = {
  'self_front': '/informations-pratiques/<id>',
  'list_front': '/informations-pratiques',
  'self_api': '/praticals-informations/<id>',
  'list_api': '/praticals-informations'
}

export const PROJECT_NAMES: SearchResultNames = {
  nice: 'Informations pratiques',
  name: 'practical-information',
}

export class PracticalInformation extends Model<PracticalInformationAttributes, PracticalInformationAttributesCreation> implements PracticalInformationAttributes {
  public id!: number
  public title!: string
  public content!: string
  public order!: number
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initPracticalInformationModel(sequelize: Sequelize) {
  PracticalInformation.init(modelBuild(PRACTICAL_INFORMATION_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'practical_information',
    underscored: true,
    indexes: [
      { fields: ['title'] },
    ]
  })
}