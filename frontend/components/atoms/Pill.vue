<template>
    <component :is="componentType" v-bind="componentAttrs" :class="containerClass">
        <slot name="icon">
            <Icon v-if="icon" :name="icon" :size="sizeToIconSize" :class="['transition-transform', iconClass]" />
        </slot>

        <slot name="label">
            <span v-if="label" class="pb-[2px]">
                {{ label }}
            </span>
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
    position?: 'left' | 'right'
    variant: ComponentVariant
    size: ComponentSize
    roundness?: ComponentRoundness
    href?: string
    center?: boolean
    clickable?: boolean
    class?: string
    iconClass?: string
}>(), {
    position: 'left',
    variant: 'primary',
    roundness: 'full',
    size: 'md',
    center: true,
    clickable: false
})

const componentType = computed(() => {
    return props.href ? NuxtLink : 'div'
})

const componentAttrs = computed(() => {
    if (props.href) {
        const isExternal = props.href.startsWith('http')

        return {
            ...attrs,
            to: props.href,
            external: isExternal,
            target: isExternal ? '_blank' : undefined
        }
    }

    return {
        ...attrs
    }
})

const sizeToButtonClass = computed(() => {
    if (props.icon && !props.label) return 'p-1'

    switch (props.size) {
        case 'sm':
            return 'text-xs px-2 py-0.5'
        case 'lg':
            return 'text-base px-4 py-1'
        case 'md':
        default:
            return 'text-sm px-3 py-0.5'
    }
})

const sizeToIconSize = computed(() => {
    switch (props.size) {
        case 'sm':
            return '1em'
        case 'lg':
            return '1.25em'
        case 'md':
        default:
            return '1.25em'
    }
})

const variantToButtonClass = computed(() => {
    switch (props.variant) {
        case 'dark':
            return 'bg-dark border-2 border-dark text-white'
        case 'light':
            return 'bg-primary/40 text-primary'
        case 'primary':
            return 'bg-primary border-2 border-primary text-white'
        case 'outline':
            return 'bg-transparent border-2 border-primary text-primary'
        case 'ghost':
        case 'gray':
            return 'bg-gray-200 border-2 border-gray-200 text-gray-800'
        case 'blur':
            return 'border-2 border-white bg-white/10 backdrop-blur-sm text-white'
        case 'transparent':
            return 'bg-transparent border-2 border-transparent text-gray-700'
        case 'danger':
            return 'bg-danger border-2 border-danger text-white'
        case 'warning':
            return 'bg-warning border-2 border-warning text-white'
        case 'success':
            return 'bg-success border-2 border-success text-white'
        default:
            return 'bg-transparent text-gray-700'
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

const containerClass = computed(() => [
    'flex',
    props.clickable
        ? 'cursor-pointer hover:brightness-90 transition-all duration-300'
        : '',
    props.position === 'left' ? 'flex-row' : 'flex-row-reverse',
    'font-medium',
    'items-center gap-1',
    props.center ? 'justify-center' : 'justify-start',
    sizeToButtonClass.value,
    variantToButtonClass.value,
    roundnessToClass.value ?? 'rounded-full',
    props.class
])
</script>