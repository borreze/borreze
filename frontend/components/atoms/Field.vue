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

        <textarea v-if="type === 'textarea'" v-bind="$attrs" :id="id" :name="name" :required="required"
            :placeholder="placeholder" :autocomplete="autocomplete" v-model="innerValue" :class="inputClass"
            @blur="emit('blur')" @focus="emit('focus')" @input="emit('input')" />
        <input v-else v-bind="$attrs" :id="id" :name="name" :required="required" :placeholder="placeholder"
            :autocomplete="autocomplete" :type="type" v-model="innerValue" :class="inputClass" @blur="emit('blur')"
            @focus="emit('focus')" @input="emit('input')" />

        <p v-if="error" class="text-sm text-danger mt-1">
            {{ error }}
        </p>
        <p v-if="warn" class="text-sm text-warning mt-1">
            {{ warn }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentRoundness, ComponentSize } from '~/types/component'

const props = withDefaults(defineProps<{
    modelValue?: string | number | undefined | null
    id?: string
    type?: | 'text' | 'textarea' | 'password' | 'email' | 'number' | 'url' | 'tel' | 'search' | 'month' | 'week' | 'time' | 'color'
    name?: string
    label?: string
    hint?: string
    placeholder?: string
    class?: string
    required?: boolean
    error?: string | null
    warn?: string | null
    size?: ComponentSize
    variant?: 'dark' | 'red'
    roundness?: ComponentRoundness
}>(), {
    type: 'text',
    placeholder: '',
    class: '',
    required: false,
    error: '',
    size: 'md',
    variant: 'red',
    roundness: 'full'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | undefined): void
    (e: 'blur'): void
    (e: 'focus'): void
    (e: 'input'): void
}>()

const innerValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val as string | number | undefined)
})

const sizeToInputClass = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'px-3 py-1'
        case 'lg':
            return 'px-5 py-3'
        case 'md':
        default:
            return 'px-4 py-2'
    }
})

const variantToInputClass = computed(() => {
    switch (props.variant) {
        case 'dark':
            return 'border-gray-300 focus:ring-dark focus:border-dark'
        case 'red':
        default:
            return 'border-gray-300 focus:ring-primary focus:border-primary'
    }
})

const roundnessToClass = computed(() => {
    switch (props.roundness) {
        case 'none':
            return 'rounded-none'
        case 'sm':
            return 'rounded-sm'
        case 'md':
            return 'rounded-md'
        case 'lg':
            return 'rounded-lg'
        case 'full':
        default:
            return 'rounded-full'
    }
})

const autocomplete = computed(() => {
    switch (props.type) {
        case 'email': return 'email'
        case 'password': return 'current-password'
        case 'tel': return 'tel'
        case 'url': return 'url'
        case 'search': return 'search'
        case 'text':
        case 'textarea':
            return 'off'
        default:
            return 'on'
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
