import { Optional } from 'sequelize'

export interface CouncilReportAttributes {
    id: number
    title: string
    date: Date
    pdf_id: number
    created_at?: Date | null
    updated_at?: Date | null
}

export type CouncilReportAttributesCreation = Optional<CouncilReportAttributes, 'id' | 'created_at' | 'updated_at'>
export type CouncilReportAttributesUpdate = Optional<CouncilReportAttributes, 'id' | 'title' | 'date' | 'pdf_id' | 'created_at' | 'updated_at'>