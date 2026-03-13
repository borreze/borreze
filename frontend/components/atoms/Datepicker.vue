<template>
    <div class="w-full flex flex-col gap-1">
        <div v-if="label || hint" class="flex justify-start flex-wrap items-end gap-2">
            <label v-if="label" :for="id" class="text-sm font-medium text-dark">
                {{ label }}
                <span v-if="required" class="text-red-500">*</span>
            </label>
            <span v-if="hint" class="text-[11px] text-gray-400 pb-[1px]">
                {{ hint }}
            </span>
        </div>

        <div class="relative w-full">
            <!-- Visible French display -->
            <input :id="id" type="text" :value="displayValue"
                :placeholder="withTime ? 'jj/mm/aaaa hh:mm' : 'jj/mm/aaaa'" :required="required"
                :class="[...inputClass, 'cursor-pointer']" readonly @click="triggerPicker" />
            <!-- Hidden native picker -->
            <input ref="pickerRef" :type="withTime ? 'datetime-local' : 'date'" :name="name" :min="min" :max="max"
                :value="pickerValue" class="absolute inset-0 opacity-0 pointer-events-none w-full"
                @change="handleChange" />
        </div>

        <p v-if="error" class="text-sm text-red-500 mt-1">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
import type { ComponentRoundness, ComponentSize } from '~/types/component'

const props = withDefaults(defineProps<{
    modelValue?: string | Date | null
    id?: string
    name?: string
    label?: string
    hint?: string
    required?: boolean
    error?: string | null
    size?: ComponentSize
    variant?: 'dark' | 'red'
    roundness?: ComponentRoundness
    withTime?: boolean
    min?: string
    max?: string
    class?: string
}>(), {
    required: false,
    error: '',
    size: 'md',
    variant: 'red',
    roundness: 'full',
    withTime: false,
    class: ''
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void
    (e: 'blur'): void
    (e: 'focus'): void
}>()

const pickerRef = ref<HTMLInputElement>()

const triggerPicker = () => pickerRef.value?.showPicker()

const toDate = (val: string | Date | null | undefined): Date | null => {
    if (!val) return null
    const d = val instanceof Date ? val : new Date(val)
    return isNaN(d.getTime()) ? null : d
}

// ISO => "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm" for the native input
const pickerValue = computed(() => {
    const date = toDate(props.modelValue)
    if (!date) return ''
    return props.withTime
        ? date.toISOString().slice(0, 16)
        : date.toISOString().slice(0, 10)
})

// ISO => French display string
const displayValue = computed(() => {
    const date = toDate(props.modelValue)
    if (!date) return ''
    const dd = String(date.getUTCDate()).padStart(2, '0')
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
    const yyyy = date.getUTCFullYear()
    if (props.withTime) {
        const hh = String(date.getUTCHours()).padStart(2, '0')
        const min = String(date.getUTCMinutes()).padStart(2, '0')
        return `${dd}/${mm}/${yyyy} ${hh}:${min}`
    }
    return `${dd}/${mm}/${yyyy}`
})

// Native input => ISO "2026-04-25T12:00:00.000Z"
const handleChange = (e: Event) => {
    const val = (e.target as HTMLInputElement).value
    if (!val) {
        emit('update:modelValue', null)
        return
    }
    // For date-only: pin to noon UTC to avoid day-shift from timezone offset
    const iso = props.withTime
        ? new Date(val).toISOString()
        : new Date(`${val}T12:00:00.000Z`).toISOString()
    emit('update:modelValue', iso)
}

const sizeToInputClass = computed(() => {
    switch (props.size) {
        case 'sm': return 'px-3 py-1'
        case 'lg': return 'px-5 py-3'
        default: return 'px-4 py-2'
    }
})

const variantToInputClass = computed(() => {
    switch (props.variant) {
        case 'dark': return 'border-gray-300 focus:ring-dark focus:border-dark'
        default: return 'border-gray-300 focus:ring-primary focus:border-primary'
    }
})

const roundnessToClass = computed(() => {
    switch (props.roundness) {
        case 'none': return 'rounded-none'
        case 'sm': return 'rounded-sm'
        case 'md': return 'rounded-md'
        case 'lg': return 'rounded-lg'
        default: return 'rounded-full'
    }
})

const inputClass = computed(() => [
    'border-2 focus:outline-none transition-all duration-150',
    'bg-white text-gray-900 w-full',
    props.error
        ? 'border-danger focus:ring-danger focus:border-danger'
        : variantToInputClass.value,
    sizeToInputClass.value,
    roundnessToClass.value,
    props.class
])
</script>