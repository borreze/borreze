<template>
    <NuxtLink v-bind="$attrs" :to="to && !disabled ? to : '#'" :external="to?.startsWith('http')"
        :target="(external || to?.startsWith('http')) ? '_blank' : undefined" :class="[
            'group cursor-pointer',
            (icon) ? 'flex items-center gap-2' : '',
            (disabled) ? 'opacity-60 cursor-not-allowed' : '',
            props.class
        ]">
        <slot name="icon">
            <Icon v-if="icon" :name="icon" size="1.25rem" :class="['text-primary transition-transform', iconClass]" />
        </slot>
        <slot name="label">
            <span v-if="label" :class="['group-hover:underline', 'group-hover:text-primary',
                (bold) ? 'font-medium' : 'font-normal'
            ]">{{ label }}</span>
        </slot>
    </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    label: string,
    icon?: string,
    to: string,
    bold?: boolean,
    disabled?: boolean,
    external?: boolean,
    class?: string
    iconClass?: string
}>(), {
    label: 'lien',
    bold: true,
    disabled: false,
    external: false
})

</script>
