import { schoolHolidayService } from './services/schoolHoliday.service'
import { Terminal } from './utils/terminal.utils'

const imprt = async () => {
  Terminal.info(`Importing school holidays...`)
  await schoolHolidayService.import()
  Terminal.success(`School holidays imported successfully`)
}

(async () => {
  try {
    await imprt()
    Terminal.success('Data import completed successfully')
    process.exit(0)
  } catch (error) {
    Terminal.error(`Error running the script: ${error}`)
    process.exit(1)
  }
})()
