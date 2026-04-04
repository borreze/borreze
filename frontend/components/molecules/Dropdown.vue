<template>
    <div ref="dropdownRef" :class="['relative inline-block text-left', label || hint ? '-translate-y-0.75' : '']">
        <div class="w-full flex flex-col gap-1">
            <div v-if="label || hint" class="flex justify-start flex-wrap items-end gap-2">
                <label v-if="label" :for="triggerId" class="text-sm font-medium text-dark">
                    {{ label }}
                    <span v-if="required" class="text-red-500">*</span>
                </label>
                <span v-if="hint" class="text-[11px] text-gray-400 pb-[1px]">
                    {{ hint }}
                </span>
            </div>
            <Button :id="triggerId" type="button" class="w-full" :size="size" :variant="variant" roundness="md"
                :aria-expanded="isOpen" :aria-haspopup="true" :disabled="disabled" :label="displayLabel"
                position="right" :center="false" icon="ic:round-keyboard-arrow-down"
                :iconClass="isOpen ? 'rotate-180' : ''" @click="toggle">
            </Button>

            <p v-if="error" class="text-sm text-danger mt-1">
                {{ error }}
            </p>
            <p v-if="warn" class="text-sm text-warning mt-1">
                {{ warn }}
            </p>
        </div>

        <Transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-show="isOpen" :class="[
                'absolute z-20 mt-2 rounded-md bg-white shadow-xl ring-1 ring-gray-200 ring-opacity-5 focus:outline-none',
                positionToDropClasses,
                minWidthClass,
                maxHeight ? `overflow-y-auto ${maxHeight}` : '',
            ]" role="menu" :aria-orientation="'vertical'" :aria-labelledby="triggerId">
                <div class="py-1">
                    <template v-if="items && items.length > 0">
                        <button v-for="(item, index) in items" :key="getItemKey(item, index)" type="button" :class="[
                            'w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between',
                            isItemSelected(item) ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                            isItemDisabled(item) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        ]" :disabled="isItemDisabled(item)" role="menuitem" @click="selectItem(item)">
                            <span>{{ getItemLabel(item) }}</span>
                            <Icon v-if="isItemSelected(item) && showCheckmark" name="ic:round-check" size="1.25em"
                                class="text-primary" />
                        </button>
                    </template>

                    <div v-else class="px-4 py-6 text-center text-sm text-gray-500">
                        Aucun élément trouvé
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any> = Record<string, any>">
import type { ComponentPosition, ComponentSize, ComponentVariant } from '~/types/component';
import Button from '~/components/atoms/Button.vue'

export interface DropdownItem {
    label: string
    value: any
    disabled?: boolean
    [key: string]: any
}

const props = withDefaults(defineProps<{
    items?: T[]
    modelValue?: string | string[] | number | number[] | null
    placeholder?: string
    labelKey?: keyof T & string
    valueKey?: keyof T & string
    variant?: ComponentVariant
    position?: ComponentPosition
    size?: ComponentSize
    minWidthClass?: string
    maxHeight?: string
    showCheckmark?: boolean
    multiple?: boolean
    closeOnSelect?: boolean
    disabled?: boolean
    required?: boolean
    label?: string
    hint?: string
    error?: string | null
    warn?: string | null
}>(), {
    items: () => [],
    modelValue: null,
    placeholder: 'Sélectionner...',
    labelKey: 'label',
    valueKey: 'value',
    variant: 'outline',
    position: 'left',
    size: 'md',
    minWidthClass: 'min-w-[200px]',
    maxHeight: 'max-h-60',
    showCheckmark: true,
    multiple: false,
    closeOnSelect: true,
    disabled: false,
    required: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: string | string[] | number | number[] | null]
    'select': [item: T]
    'open': []
    'close': []
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const triggerId = `dropdown-trigger-${uniqueId()}`

const selectedItem = computed(() => props.modelValue)

const displayLabel = computed(() => {
    if (selectedItem.value === null || selectedItem.value === undefined) return props.placeholder

    if (props.multiple && Array.isArray(selectedItem.value)) {
        if (selectedItem.value.length === 0) return props.placeholder
        return selectedItem.value
            .map(val => {
                const found = props.items.find(i => getItemValue(i) === val)
                return found ? getItemLabel(found) : val
            })
            .join(', ')
    }

    const found = props.items.find(i => getItemValue(i) === selectedItem.value)
    return found ? getItemLabel(found) : props.placeholder
})

const positionToDropClasses = computed(() => {
    switch (props.position) {
        case 'left':
            return 'left-0 origin-top-left'
        case 'right':
            return 'right-0 origin-top-right'
        case 'center':
            return 'left-1/2 -translate-x-1/2 origin-top'
        default:
            return 'left-0 origin-top-left'
    }
})

const toggle = () => {
    if (props.disabled) return
    isOpen.value ? close() : open()
}

const open = () => {
    if (props.disabled) return
    isOpen.value = true
    emit('open')
}

const close = () => {
    isOpen.value = false
    emit('close')
}

const selectItem = (item: T) => {
    if (isItemDisabled(item)) return

    const value = getItemValue(item)  // string garanti

    if (props.multiple) {
        const currentValue = Array.isArray(selectedItem.value) ? selectedItem.value : []
        const isSelected = isItemSelected(item)

        const newValue = isSelected
            ? currentValue.filter(v => v !== value)
            : [...currentValue, value]

        emit('update:modelValue', newValue as string | string[] | number | number[] | null)
        emit('select', item)
        return
    }

    emit('update:modelValue', value)
    emit('select', item)

    if (props.closeOnSelect) close()
}

const isItemDisabled = (item: T): boolean => {
    if (typeof item === 'object' && item !== null && 'disabled' in item) {
        return Boolean((item as any).disabled)
    }
    return false
}

const isItemSelected = (item: T): boolean => {
    if (selectedItem.value === null || selectedItem.value === undefined) return false
    const value = getItemValue(item)

    if (props.multiple && Array.isArray(selectedItem.value)) {
        return (selectedItem.value as (string | number)[]).includes(value)
    }

    return selectedItem.value === value
}

const getItemLabel = (item: T): string => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null && props.labelKey in item) {
        return (item as any)[props.labelKey]
    }
    return String(item)
}

const getItemValue = (item: T): string | number => {
    if (typeof item === 'object' && item !== null && props.valueKey in item) {
        return (item as any)[props.valueKey]
    }
    return String(item)
}

const getItemKey = (item: T, index: number): string | number => {
    if (typeof item === 'object' && item !== null && props.valueKey in item) {
        return (item as any)[props.valueKey]
    }
    return index
}

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        close()
    }
}

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside)
})

defineExpose({
    open,
    close,
    toggle,
    isOpen
})
</script>