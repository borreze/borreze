<template>
    <div class="w-full flex flex-col gap-1">
        <div class="flex items-center gap-3">
            <button type="button" role="switch" :aria-checked="innerValue" :id="id" @click="innerValue = !innerValue"
                :class="[
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
                    innerValue ? 'bg-primary focus:ring-primary' : 'bg-gray-300 focus:ring-gray-300'
                ]">
                <span :class="[
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out',
                    innerValue ? 'translate-x-5' : 'translate-x-0'
                ]" />
            </button>
            <label v-if="label" :for="id" class="text-sm font-medium text-dark cursor-pointer select-none"
                @click="innerValue = !innerValue">
                {{ label }}
                <span v-if="required" class="text-red-500">*</span>
            </label>
            <span v-if="hint" class="text-[11px] text-gray-400">{{ hint }}</span>
        </div>
        <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue?: boolean
    id?: string
    label?: string
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