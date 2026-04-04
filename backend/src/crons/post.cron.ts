import { postService } from '../services/post.service'
import cron from 'node-cron'
import { Terminal } from '../utils/terminal.utils'
import { Log } from '../utils/log.utils'

export function initPostCron(): void {
    Terminal.info('Initializing post cron job')

    cron.schedule('0 * * * *', async () => { // Every hour
        try {
            await postService.computeLocation()
        } catch (error) {
            Log.error(`Erreur lors du calcul des latitudes et longitudes des posts : ${error}`)
            Terminal.error(`Error computing posts locations ${error}`)
        }
    })

    cron.schedule('*/10 * * * *', async () => { // Every 10 min
        try {
            await postService.computeStatus()
        } catch (error) {
            Log.error(`Erreur lors du calcul des statuts des posts : ${error}`)
            Terminal.error(`Error computing posts statuses ${error}`)
        }
    })
}
