<template>
    <component :is="tag" :class="['wy-prose', `wy-prose--${size}`]" v-html="safeHtml" />
</template>

<script setup lang="ts">
import '~/assets/css/wysiwyg-prose.css'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    html: string
    tag?: string
    size?: 'sm' | 'md' | 'lg'
    sanitize?: boolean
}>(), {
    tag: 'div',
    size: 'md',
    sanitize: false,
})

const safeHtml = computed(() => {
    if (!props.sanitize) return props.html
    return sanitizeHtml(props.html)
})
</script>

<style scoped>
.wy-prose--sm {
    font-size: 0.875rem;
}

.wy-prose--md {
    font-size: 1rem;
}

.wy-prose--lg {
    font-size: 1.125rem;
}
</style>