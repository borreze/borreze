export function useForm<K extends string>(
    keys: K[],
    validators: Partial<Record<K, () => string | null>>
) {
    const touched = ref(
        Object.fromEntries(keys.map(k => [k, false])) as Record<K, boolean>
    )

    const errors = computed(() =>
        Object.fromEntries(
            keys.map(k => [
                k,
                touched.value[k] ? (validators[k]?.() ?? null) : null
            ])
        ) as Record<K, string | null>
    )

    const touch = (key: K) => { touched.value[key] = true }

    const untouch = (key: K) => { touched.value[key] = false }

    const touchAll = () => keys.forEach(k => { touched.value[k] = true })

    const untouchAll = () => keys.forEach(k => { touched.value[k] = false })

    const hasErrors = computed(() => Object.values(errors.value).some(Boolean))

    const submit = async (cb: () => void | Promise<void>) => {
        touchAll()
        if (!hasErrors.value) await cb()
    }

    return { touched, errors, untouch, touch, touchAll, untouchAll, hasErrors, submit }
}