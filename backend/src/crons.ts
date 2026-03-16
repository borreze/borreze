import { postService } from './services/post.service'
import { schoolHolidayService } from './services/schoolHoliday.service'
import { Terminal } from './utils/terminal.utils'

const schoolHolidaysImport = async () => {
  Terminal.info(`Importing school holidays...`)
  await schoolHolidayService.import()
  Terminal.success(`School holidays imported successfully`)
}

const postsStatusComputation = async () => {
  Terminal.info(`Computing posts statuses...`)
  await postService.computeStatuses()
  Terminal.success(`Posts statuses computed successfully`)
}

(async () => {
  try {
    await schoolHolidaysImport()
    await postsStatusComputation()
    Terminal.success('Data import completed successfully')
    process.exit(0)
  } catch (error) {
    Terminal.error(`Error running the script: ${error}`)
    process.exit(1)
  }
})()
