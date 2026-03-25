export function useDebounce(fn: () => void, delay: number = 500) {
    let timer: ReturnType<typeof setTimeout> | null = null

    const run = () => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(fn, delay)
    }

    const cancel = () => {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
    }

    onUnmounted(cancel)

    return { run, cancel }
}