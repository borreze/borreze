import { logService } from '../services/log.service'
import cron from 'node-cron'
import { Terminal } from '../utils/terminal.utils'
import { Log } from '../utils/log.utils'

export function initLogCron(): void {
    Terminal.info('Initializing log cron job')

    cron.schedule('0 0 * * *', async () => { // Every day at midnight
        try {
            await logService.clearOlds()
        } catch (error) {
            Log.error(`Erreur lors du nettoyage des journaux d'activité : ${error}`)
            Terminal.error(`Error clearing logs ${error}`)
        }
    })
}
