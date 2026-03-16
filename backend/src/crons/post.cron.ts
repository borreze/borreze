import { postService } from '../services/post.service'
import cron from 'node-cron'
import { Terminal } from '../utils/terminal.utils'
import { Log } from '../utils/log.utils'

export function initPostCron(): void {
    Terminal.info('Initializing post cron job')
    cron.schedule('*/10 * * * *', async () => { // Every 10 min
        try {
            await postService.computeStatuses()
        } catch (error) {
            Log.error(`Error computing posts statuses ${error}`)
            Terminal.error(`Error computing posts statuses ${error}`)
        }
    })
}
