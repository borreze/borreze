import { DataTypes, Model, Sequelize } from 'sequelize'
import { CouncilReportAttributes, CouncilReportAttributesCreation } from '@brz/shared'
import { Media } from './media.model'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const COUNCIL_REPORT_CONSTRAINTS = {
  id: {
    nicename: 'ID',
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    nicename: 'Titre',
    type: DataTypes.STRING,
    maxLength: 255,
    required: true,
    searchable: true
  },
  date: {
    nicename: 'Date',
    type: DataTypes.DATE,
    required: true
  },
  pdf_id: {
    nicename: 'PDF',
    type: DataTypes.BIGINT,
    required: true
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
} as const satisfies ModelConstraints<CouncilReportAttributes>

export const COUNCIL_REPORT_INCLUDE_DEFAULTS = [
  { model: Media, as: 'pdf' }
]

export class CouncilReport extends Model<CouncilReportAttributes, CouncilReportAttributesCreation> implements CouncilReportAttributes {
  public id!: number
  public title!: string
  public date!: Date
  public pdf_id!: number
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initCouncilReportModel(sequelize: Sequelize) {
  CouncilReport.init(modelBuild(COUNCIL_REPORT_CONSTRAINTS), {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'council_report',
    underscored: true,
    indexes: [
      { fields: ['title'] },
    ]
  })
}