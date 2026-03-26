<template>
    <div v-if="props?.items && props.items.length > 0" class="grid" :style="gridStyle">
        <div v-for="(item, index) in props.items" :key="getKey(item, index)">
            <slot name="item" :item="item" :index="index"></slot>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
import type { Breakpoint } from '~/types/component';

const props = withDefaults(defineProps<{
    items?: T[] | null
    gap?: number | string
    keyField?: string
    layouts?: Partial<Record<Breakpoint, number>>
}>(), {
    gap: 'responsive',
    keyField: 'id',
    layouts: () => ({ default: 1, sm: 2, lg: 3, xl: 4 }),
})

const gridStyle = computed(() => {
    const styles: Record<string, string> = {}

    if (typeof props.gap === 'number') {
        styles.gap = `${props.gap}rem`
    } else if (props.gap === 'responsive') {
        // do nothing
    } else {
        styles.gap = props.gap
    }

    if (props.layouts) {
        const bpMap: Record<Breakpoint, string> = {
            'default': '--grid-cols-default',
            'xs':      '--grid-cols-xs',
            'sm':      '--grid-cols-sm',
            'md':      '--grid-cols-md',
            'lg':      '--grid-cols-lg',
            'xl':      '--grid-cols-xl',
            '2xl':     '--grid-cols-2xl',
            '3xl':     '--grid-cols-3xl',
        }
        for (const [bp, cols] of Object.entries(props.layouts) as [Breakpoint, number][]) {
            if (cols !== undefined) styles[bpMap[bp]] = String(cols)
        }
    }

    return styles
})

const getKey = (item: T, index: number): string | number => {
    if (typeof item === 'object' && item !== null && props.keyField in item) {
        return (item as any)[props.keyField]
    }
    return index
}
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-cols-default, 1), minmax(0, 1fr));
}

@media (min-width: 480px) {
    .grid {
        grid-template-columns: repeat(var(--grid-cols-xs, var(--grid-cols-default, 1)), minmax(0, 1fr));
    }
}

@media (min-width: 640px) {
    .grid {
        grid-template-columns: repeat(var(--grid-cols-sm, var(--grid-cols-default, 1)), minmax(0, 1fr));
    }
}

@media (min-width: 768px) {
    .grid {
        grid-template-columns: repeat(var(--grid-cols-md, var(--grid-cols-sm, var(--grid-cols-default, 1))), minmax(0, 1fr));
    }
}

@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(var(--grid-cols-lg, var(--grid-cols-md, var(--grid-cols-sm, var(--grid-cols-default, 1)))), minmax(0, 1fr));
    }
}

@media (min-width: 1280px) {
    .grid {
        grid-template-columns: repeat(var(--grid-cols-xl, var(--grid-cols-lg, var(--grid-cols-md, var(--grid-cols-sm, var(--grid-cols-default, 1))))), minmax(0, 1fr));
    }
}

@media (min-width: 1536px) {
    .grid {
        grid-template-columns: repeat(var(--grid-cols-2xl, var(--grid-cols-xl, var(--grid-cols-lg, var(--grid-cols-md, var(--grid-cols-sm, var(--grid-cols-default, 1)))))), minmax(0, 1fr));
    }
}

@media (min-width: 1920px) {
    .grid {
        grid-template-columns: repeat(var(--grid-cols-3xl, var(--grid-cols-2xl, var(--grid-cols-xl, var(--grid-cols-lg, var(--grid-cols-md, var(--grid-cols-sm, var(--grid-cols-default, 1))))))), minmax(0, 1fr));
    }
}

.grid:not([style*="gap"]) {
    gap: 1rem;
}

@media (min-width: 1536px) {
    .grid:not([style*="gap"]) {
        gap: 1.5rem;
    }
}

@media (min-width: 1280px) and (max-width: 1535px) {
    .grid:not([style*="gap"]) {
        gap: 2.5rem;
    }
}

@media (min-width: 1024px) and (max-width: 1279px) {
    .grid:not([style*="gap"]) {
        gap: 2rem;
    }
}

@media (min-width: 768px) and (max-width: 1023px) {
    .grid:not([style*="gap"]) {
        gap: 1.5rem;
    }
}

@media (min-width: 640px) and (max-width: 767px) {
    .grid:not([style*="gap"]) {
        gap: 1.5rem;
    }
}

@media (max-width: 639px) {
    .grid:not([style*="gap"]) {
        gap: 1.5rem;
    }
}
</style>