import { SchoolHoliday } from '../models'
import { WhereOptions } from 'sequelize'
import { Pagination } from '@brz/shared'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '@brz/shared'
import { GovApiResponse, SchoolHolidayAttributes, SchoolHolidayAttributesCreation, SchoolYear } from '@brz/shared'
import { searchWhere, validateAll } from '../utils/model.utils'
import { SCHOOL_HOLIDAY_CONSTRAINTS } from '../models/schoolHoliday.model'
import { ValidationException } from '../exceptions/validation.exception'
import { NotFound } from '../exceptions/request.exception'
import { paginationDefault } from '@brz/shared'
import { currentSchoolYear } from '../utils/date.utils'
import { ImportException } from '../exceptions/import.exception'
import { Terminal } from '../utils/terminal.utils'

export class SchoolHolidayService {
  private filterByYear(year?: SchoolYear | 'all' | 'current' | null): WhereOptions {
    if (year === 'all') return {}
    if (year === 'current') return { year: currentSchoolYear() }
    return { year }
  }

  public async count(options?: { search?: string, year?: SchoolYear | null }): Promise<number> {
    const { search, year } = options || {}

    const where: WhereOptions = {
      ...searchWhere(SCHOOL_HOLIDAY_CONSTRAINTS, search),
      ...this.filterByYear(year)
    }

    const result = await SchoolHoliday.count({ where })
    return Number(result)
  }

  public async getAll(options?: { search?: string; year?: SchoolYear | null }, order: Order[] = [], pagination?: Pagination | null): Promise<SchoolHolidayAttributes[]> {
    const { search, year } = options || {}
    const { offset, limit } = pagination || paginationDefault()

    const where: WhereOptions = {
      ...searchWhere(SCHOOL_HOLIDAY_CONSTRAINTS, search),
      ...this.filterByYear(year)
    }

    const schoolHolidays = await SchoolHoliday.findAll({ where, order, offset, limit })
    return schoolHolidays
  }

  public async create(data: SchoolHolidayAttributesCreation): Promise<SchoolHolidayAttributes | null> {
    delete data.id // ensure id is not set

    const { valid, errors } = validateAll(data, SCHOOL_HOLIDAY_CONSTRAINTS)
    if (!valid) throw new ValidationException('Des champs sont manquants', errors)

    return sequelize.transaction(async (transaction: Transaction) => {
      return SchoolHoliday.create(data, { transaction })
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await SchoolHoliday.destroy({ where: { id } })
    if (!result) throw new NotFound('School holidays not found')
    return result
  }

  public async import(): Promise<void> {
    const API_URL = 'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records'
    const PAGE_SIZE = 99 // ! Real max gouvernement API limit is 100
    const FROM_YEAR = 2024

    Terminal.info(`Starting school holidays import from GOUV API...`)

    let offset = 0
    let totalCount = 0
    let imported = 0
    let skipped = 0

    // First import: clear all records to avoid duplicates 
    SchoolHoliday.destroy({ where: {}, truncate: true })

    do {
      const url = `${API_URL}?limit=${PAGE_SIZE}&offset=${offset}&order_by=start_date%20ASC`
      const res = await fetch(url)
      if (!res.ok) throw new ImportException(`GOUV API error ${res.status}: ${res.statusText}`)
      const data: GovApiResponse = await res.json()

      totalCount = data.total_count

      // ? Limit to results having
      // ? zones = 'Zone A'
      // ? location = 'Bordeaux'
      // ? population = 'Élèves' or '-'
      const records = data.results.filter(r => (
        r.zones === 'Zone A' &&
        r.location === 'Bordeaux' &&
        (r.population === 'Élèves' || r.population === '-') &&
        new Date(r.start_date).getFullYear() >= FROM_YEAR
      ))

      // Deduplicate: same name + year + date_start = same holiday period (multiple locations/zones per record)
      const unique = new Map<string, typeof records[0]>()
      for (const r of records) {
        const key = `${r.description}_${r.annee_scolaire}_${r.start_date}`
        if (!unique.has(key)) unique.set(key, r)
      }

      for (const record of unique.values()) {
        const schoolHolyday = {
          name: record.description.trim(),
          year: record.annee_scolaire as SchoolYear,
          date_start: new Date(record.start_date),
          date_end: new Date(record.end_date),
        }

        const [, created] = await SchoolHoliday.findOrCreate({
          where: {
            name: schoolHolyday.name,
            year: schoolHolyday.year,
            date_start: schoolHolyday.date_start,
          },
          defaults: schoolHolyday
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        created ? imported++ : skipped++
      }

      offset += PAGE_SIZE
    } while (offset < totalCount)

    Terminal.info(`School holidays import done. Imported: ${imported}, skipped: ${skipped}`)
  }
}

export const schoolHolidayService = new SchoolHolidayService()
