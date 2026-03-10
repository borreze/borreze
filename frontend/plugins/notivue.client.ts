import { createNotivue } from 'notivue'

export default defineNuxtPlugin(() => {
    const app = useNuxtApp()

    app.vueApp.use(createNotivue({
        position: isInBO() ? 'bottom-right' : 'top-left',
        limit: 3,
        enqueue: true,
        avoidDuplicates: true,
        notifications: {
            global: {
                duration: 7000
            }
        }
    }))
})