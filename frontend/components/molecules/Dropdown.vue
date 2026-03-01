<template>
    <div ref="dropdownRef" class="relative inline-block text-left">
        <div class="w-full flex flex-col gap-1">
            <label v-if="label" class="text-sm font-medium text-dark">
                {{ label }}
                <span v-if="required" class="text-red-500">*</span>
            </label>
            <Button :id="triggerId" type="button" class="w-full" :size="size" :variant="variant" roundness="md"
                :aria-expanded="isOpen" :aria-haspopup="true" :disabled="disabled" :label="displayLabel"
                position="right" :center="false" icon="ic:round-keyboard-arrow-down"
                :iconClass="isOpen ? 'rotate-180' : ''" @click="toggle">
            </Button>
        </div>

        <Transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-show="isOpen" :class="[
                'absolute z-10 mt-2 rounded-md bg-white shadow-xl ring-1 ring-gray-200 ring-opacity-5 focus:outline-none',
                positionToDropClasses,
                minWidth,
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

<script setup lang="ts" generic="T = any">
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
    modelValue?: T | T[] | null
    placeholder?: string
    labelKey?: string
    valueKey?: string
    variant?: ComponentVariant
    position?: ComponentPosition
    size?: ComponentSize
    minWidth?: string
    maxHeight?: string
    showCheckmark?: boolean
    multiple?: boolean
    closeOnSelect?: boolean
    disabled?: boolean
    required?: boolean
    label?: string
}>(), {
    items: () => [],
    modelValue: null,
    placeholder: 'Sélectionner...',
    labelKey: 'label',
    valueKey: 'value',
    variant: 'outline',
    position: 'left',
    size: 'md',
    minWidth: 'min-w-[200px]',
    maxHeight: 'max-h-60',
    showCheckmark: true,
    multiple: false,
    closeOnSelect: true,
    disabled: false,
    required: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: T | T[] | null]
    'select': [item: T]
    'open': []
    'close': []
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const triggerId = `dropdown-trigger-${uniqueId()}`

const selectedItem = computed(() => props.modelValue)

const displayLabel = computed(() => {
    if (!selectedItem.value) {
        return props.placeholder
    }

    if (props.multiple && Array.isArray(selectedItem.value)) {
        if (selectedItem.value.length === 0) {
            return props.placeholder
        }
        return selectedItem.value.map(item => getItemLabel(item)).join(', ')
    }

    return getItemLabel(selectedItem.value as T)
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

    if (props.multiple) {
        const currentValue = Array.isArray(selectedItem.value) ? selectedItem.value : []
        const isSelected = isItemSelected(item)

        let newValue: T[]
        if (isSelected) {
            newValue = currentValue.filter(v => !isSameItem(v, item))
        } else {
            newValue = [...currentValue, item]
        }

        emit('update:modelValue', newValue)
        emit('select', item)

        return
    }

    emit('update:modelValue', item)
    emit('select', item)

    if (props.closeOnSelect) {
        close()
    }
}

const isItemDisabled = (item: T): boolean => {
    if (typeof item === 'object' && item !== null && 'disabled' in item) {
        return Boolean((item as any).disabled)
    }
    return false
}

const isItemSelected = (item: T): boolean => {
    if (!selectedItem.value) return false

    if (props.multiple && Array.isArray(selectedItem.value)) {
        return selectedItem.value.some(v => isSameItem(v, item))
    }

    return isSameItem(selectedItem.value as T, item)
}

const isSameItem = (item1: T, item2: T): boolean => {
    if (typeof item1 === 'object' && item1 !== null && props.valueKey in item1) {
        return (item1 as any)[props.valueKey] === (item2 as any)[props.valueKey]
    }

    return item1 === item2
}

const getItemLabel = (item: T): string => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null && props.labelKey in item) {
        return (item as any)[props.labelKey]
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