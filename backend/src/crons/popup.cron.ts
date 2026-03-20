import { popupService } from '../services/popup.service'
import cron from 'node-cron'
import { Terminal } from '../utils/terminal.utils'
import { Log } from '../utils/log.utils'

export function initPopupCron(): void {
    Terminal.info('Initializing popup cron job')
    cron.schedule('*/10 * * * *', async () => { // Every 10 min
        try {
            await popupService.computeActive()
        } catch (error) {
            Log.error(`Error computing popups statuses ${error}`)
            Terminal.error(`Error computing popups statuses ${error}`)
        }
    })
}
