<template>
    <component :is="componentType" v-bind="componentAttrs" :class="buttonClass">
        <slot v-if="loading || icon" name="icon" class="flex items-center gap-2">
            <Icon v-if="loading" name="eos-icons:loading" :size="sizeToIconSize" class="animate-spin" />
            <Icon v-else-if="icon" :name="icon" :size="sizeToIconSize" :class="['transition-transform', iconClass]" />
        </slot>

        <slot v-if="label" name="label" class="pb-[2px]">
            {{ label }}
        </slot>
    </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { NuxtLink } from '#components'
import type { ComponentRoundness, ComponentSize, ComponentVariant } from '~/types/component'

const attrs = useAttrs()

const props = withDefaults(defineProps<{
    label?: string | number
    icon?: string
    type?: 'button' | 'submit' | 'reset'
    as?: 'button' | 'link'
    position?: 'left' | 'right'
    variant: ComponentVariant
    size?: ComponentSize
    roundness?: ComponentRoundness
    href?: string
    center?: boolean
    disabled?: boolean
    loading?: boolean
    class?: string
    iconClass?: string
}>(), {
    label: '',
    type: 'button',
    as: 'button',
    position: 'left',
    variant: 'primary',
    size: 'md',
    roundness: 'full',
    center: true,
    disabled: false,
    loading: false
})

const componentType = computed(() => {
    return props.as === 'link' ? NuxtLink : 'button'
})

const componentAttrs = computed(() => {
    if (props.as === 'link') {
        const isExternal = props.href?.startsWith('http')

        return {
            ...attrs,
            to: props.href,
            external: isExternal,
            target: isExternal ? '_blank' : undefined
        }
    }

    return {
        ...attrs,
        type: props.type,
        disabled: props.disabled || props.loading
    }
})

const sizeToButtonClass = computed(() => {
    if (props.icon && !props.label) return 'p-1'

    switch (props.size) {
        case 'sm':
            return 'text-sm px-3 py-1.5'
        case 'lg':
            return 'text-lg px-5 py-3'
        case 'md':
        default:
            return 'text-base px-4 py-2'
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

const sizeToIconSize = computed(() => {
    switch (props.size) {
        case 'sm':
            return '1.25em'
        case 'lg':
            return '2.25em'
        case 'md':
        default:
            return '1.5em'
    }
})

const variantToButtonClass = computed(() => {
    switch (props.variant) {
        case 'dark':
            return 'bg-dark border-2 border-dark text-white hover:brightness-90'
        case 'light':
            return 'bg-white text-gray-900 border-2 border-gray-300 focus:ring-primary focus:border-primary transition-all duration-150'
        case 'primary':
            return 'bg-primary border-2 border-primary text-white hover:brightness-90'
        case 'outline':
            return 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white'
        case 'ghost':
            return 'bg-transparent text-dark hover:bg-gray-100'
        case 'gray':
            return 'bg-gray-200 border-2 border-gray-200 text-gray-800 hover:brightness-90'
        case 'blur':
            return 'border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
        case 'transparent':
            return 'bg-transparent text-gray-700'
        case 'danger':
            return 'bg-danger border-2 border-danger text-white hover:brightness-90'
        case 'warning':
            return 'bg-warning border-2 border-warning text-white hover:brightness-90'
        case 'success':
            return 'bg-success border-2 border-success text-white hover:brightness-90'
        default:
            return 'bg-transparent text-gray-700 hover:bg-gray-100'
    }
})

const buttonClass = computed(() => [
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark',
    'flex',
    props.position === 'left' ? 'flex-row' : 'flex-row-reverse',
    'items-center gap-2 transition-all duration-300',
    props.center ? 'justify-center' : 'justify-between',
    sizeToButtonClass.value,
    variantToButtonClass.value,
    roundnessToClass.value,
    (props.disabled || props.loading)
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer',
    props.class
])
</script>