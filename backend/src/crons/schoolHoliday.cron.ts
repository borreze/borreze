import { schoolHolidayService } from '../services/schoolHoliday.service'
import cron from 'node-cron'
import { Terminal } from '../utils/terminal.utils'

export function initSchoolHolidayCron(): void {
    Terminal.info('Initializing school holiday import cron job')
    cron.schedule('0 2 * * 0', async () => { // Every Sunday at 2:00 AM
        try {
            await schoolHolidayService.import()
        } catch (error) {
            Terminal.error(`Error importing school holidays ${error}`)
        }
    })
}
