import { Optional } from 'sequelize'

export type SchoolYear = `${number}-${number}`

export interface SchoolHolidayAttributes {
    id: number
    name: string
    year: SchoolYear
    date_start: Date
    date_end: Date
    created_at?: Date | null
    updated_at?: Date | null
}

export type SchoolHolidayAttributesCreation = Optional<SchoolHolidayAttributes, 'id' | 'created_at' | 'updated_at'>
export type SchoolHolidayAttributesUpdate = Optional<SchoolHolidayAttributes, 'id' | 'name' | 'year' | 'date_start' | 'date_end' | 'created_at' | 'updated_at'>

export interface GovApiRecord {
    description: string
    population: string
    start_date: string
    end_date: string
    location: string
    zones: string
    annee_scolaire: string
}

export interface GovApiResponse {
    total_count: number
    results: GovApiRecord[]
}