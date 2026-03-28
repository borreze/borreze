interface FormField<K extends string> {
    name: K
    label: string
    validation?: () => string | null
}

export function useForm<K extends string>(fields: FormField<K>[]) {
    const keys = fields.map(f => f.name)

    const validators = Object.fromEntries(
        fields.filter(f => f.validation).map(f => [f.name, f.validation!])
    ) as Partial<Record<K, () => string | null>>

    const labels = Object.fromEntries(
        fields.map(f => [f.name, f.label])
    ) as Record<K, string>

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

    // Return a boolean indicating whether any field could have an error (i.e. is either touched or not, but has a validator that returns an error)
    const couldHaveErrors = computed(() => keys.some(k => validators[k] && validators[k]!() !== null))

    // Return a boolean indicating whether any field currently has an error (i.e. is touched AND has a validator that returns an error)
    const hasErrors = computed(() => Object.values(errors.value).some(Boolean))

    /** Labels of fields currently in error (touched + failing validation) */
    const errorLabels = computed(() =>
        keys.filter(k => errors.value[k]).map(k => labels[k].toLowerCase())
    )

    const submit = async (cb: () => void | Promise<void>) => {
        touchAll()
        if (!hasErrors.value) await cb()
    }

    return { touched, errors, errorLabels, labels, untouch, touch, touchAll, untouchAll, couldHaveErrors, hasErrors, submit }
}