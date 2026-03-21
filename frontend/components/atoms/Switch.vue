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
        <div class="flex items-center gap-3 my-2">
            <button type="button" role="switch" :aria-checked="innerValue" :id="id" @click="innerValue = !innerValue"
                :class="[
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dark',
                    innerValue ? 'bg-primary' : 'bg-gray-300'
                ]">
                <span :class="[
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out',
                    innerValue ? 'translate-x-5' : 'translate-x-0'
                ]" />
            </button>
            <span v-if="text" class="font-medium text-dark cursor-pointer select-none"
                @click="innerValue = !innerValue">
                {{ text }}
            </span>
        </div>
        <p v-if="error" class="text-sm text-danger mt-1">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue?: boolean
    id?: string
    label?: string
    text?: string
    hint?: string
    required?: boolean
    error?: string | null
}>(), {
    modelValue: false,
    required: false,
    error: '',
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'blur'): void
    (e: 'focus'): void
    (e: 'change', value: boolean): void
}>()

const innerValue = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit('update:modelValue', val)
        emit('change', val)
    }
})
</script>