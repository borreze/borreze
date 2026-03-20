import { popupService } from './services/popup.service'
import { postService } from './services/post.service'
import { schoolHolidayService } from './services/schoolHoliday.service'
import { Terminal } from './utils/terminal.utils'

(async () => {
  try {
    await schoolHolidayService.import()
    await postService.computeStatuses()
    await popupService.computeActive()

    Terminal.success('Data import completed successfully')
    process.exit(0)
  } catch (error) {
    Terminal.error(`Error running the script: ${error}`)
    process.exit(1)
  }
})()
