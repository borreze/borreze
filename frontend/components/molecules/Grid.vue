<template>
    <div v-if="props?.items && props.items.length > 0" class="grid" :style="gridStyle">
        <div v-for="(item, index) in props.items" :key="getKey(item, index)">
            <slot name="item" :item="item" :index="index"></slot>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
const props = withDefaults(defineProps<{
    items?: T[] | null
    minWidth?: number | string | null
    maxWidth?: number | string | null
    gap?: number | string
    cols?: number
    keyField?: string
}>(), {
    minWidth: 350,
    maxWidth: null,
    gap: 'responsive',
    keyField: 'id'
})

const gridStyle = computed(() => {
    const minWidthValue =
        typeof props.minWidth === 'number'
            ? `${props.minWidth}px`
            : props.minWidth

    const maxWidthValue =
        typeof props.maxWidth === 'number'
            ? `${props.maxWidth}px`
            : props.maxWidth

    let gapValue: string
    if (typeof props.gap === 'number') {
        gapValue = `${props.gap}rem`
    } else if (props.gap === 'responsive') {
        gapValue = ''
    } else {
        gapValue = props.gap
    }

    const styles: Record<string, string> = {}

    if (props.cols) {
        styles.gridTemplateColumns = `repeat(${props.cols}, 1fr)`
    } else {
        styles.gridTemplateColumns = `repeat(auto-fill, minmax(${minWidthValue}, ${maxWidthValue ?? '1fr'}))`
    }

    if (gapValue) {
        styles.gap = gapValue
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