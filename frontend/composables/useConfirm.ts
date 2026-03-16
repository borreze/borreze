interface ConfirmOptions {
    title?: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning' | 'info'
}

interface ConfirmState {
    open: boolean
    options: ConfirmOptions
    resolve: ((value: boolean) => void) | null
}

export const useConfirm = () => {
    const state = useState<ConfirmState>('confirm-dialog', () => ({
        open: false,
        options: { message: '' },
        resolve: null,
    }))

    const confirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            state.value = {
                open: true,
                options,
                resolve,
            }
        })
    }

    const _accept = () => {
        state.value.resolve?.(true)
        state.value.open = false
    }

    const _cancel = () => {
        state.value.resolve?.(false)
        state.value.open = false
    }

    return { confirm, _state: state, _accept, _cancel }
}