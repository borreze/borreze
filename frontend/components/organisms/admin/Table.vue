<template>
    <div class="p-2 sm:p-3 md:p-4 rounded-lg">
        <Loader v-if="loading" />
        <div v-else>
            <!-- Desktop -->
            <div class="hidden lg:block min-w-full overflow-hidden">
                <div class="text-dark bg-white text-left grid gap-4 px-4 py-4 rounded-lg font-semibold"
                    :style="{ gridTemplateColumns: gridCols }">
                    <div v-for="column in columns" :key="column.key">{{ column.label }}</div>
                </div>
                <div class="space-y-2">
                    <NuxtLink v-for="(item, index) in items" :key="getItemKey(item, index)" :to="getItemRoute(item)"
                        :class="index % 2 === 1 ? 'bg-white rounded-lg' : 'bg-transparent'"
                        class="grid gap-4 px-4 py-2 text-sm 2xl:text-base" :style="{ gridTemplateColumns: gridCols }">
                        <div v-for="column in columns" :key="column.key" :class="column.class || ''">
                            <slot :name="`cell-${column.key}`" :item="item" :value="getItemValue(item, column.key)">
                                <template v-if="column.formatter && formatters[column.formatter]">
                                    {{ formatters[column.formatter](getItemValue(item, column.key)) }}
                                </template>
                                <template v-else>
                                    {{ getItemValue(item, column.key) }}
                                </template>
                            </slot>
                        </div>
                    </NuxtLink>
                    <NoItem v-if="items.length === 0" />
                </div>
            </div>

            <!-- Mobile -->
            <div class="block lg:hidden space-y-3">
                <div v-for="(item, index) in items" :key="getItemKey(item, index)"
                    class="bg-white rounded-lg p-4 shadow-sm">
                    <NuxtLink :to="getItemRoute(item)" class="block">
                        <div class="flex justify-between items-start mb-2">
                            <div class="font-semibold text-dark">{{ getItemValue(item, darkKey) }}</div>
                            <slot name="mobile-action" :item="item">
                            </slot>
                        </div>

                        <div v-if="titleKey" class="text-sm text-gray-800 mb-2">{{ getItemValue(item, titleKey) }}</div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                            <div v-for="column in mobileVisibleColumns" :key="column.key">
                                <span class="font-medium">{{ column.label }}:</span>
                                <span v-if="column.formatter && formatters[column.formatter]">
                                    {{ formatters[column.formatter](getItemValue(item, column.key)) }}
                                </span>
                                <span v-else>{{ getItemValue(item, column.key) }}</span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
                <NoItem v-if="items.length === 0" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends object">
import Loader from '~/components/molecules/Loader.vue';
import NoItem from '~/components/molecules/NoItem.vue';

interface Column {
    key: string
    label: string
    class?: string
    formatter?: string
}

type FormatterFn = (value: unknown) => string | number

const props = withDefaults(defineProps<{
    items: T[]
    columns: Column[]
    getItemRoute: (item: T) => string
    darkKey?: string
    titleKey?: string
    loading?: boolean
    formatters?: Record<string, FormatterFn>
}>(), {
    darkKey: 'id',
    titleKey: 'subject',
    loading: false,
    formatters: () => ({})
})

defineSlots<{
    'mobile-action'(props: { item: T }): unknown
    [key: `cell-${string}`]: (props: { item: T; value: unknown }) => unknown
}>()

const gridCols = computed(() => `repeat(${props.columns.length}, minmax(0, 1fr))`)

const mobileVisibleColumns = computed(() =>
    props.columns.filter(col =>
        col.key !== props.darkKey &&
        col.key !== props.titleKey 
    )
)

const getItemKey = (item: T, index: number): string | number => {
    const obj = item as Record<string, unknown>
    return (obj?.id ?? obj?.ref ?? obj?.[props.darkKey ?? 'id'] ?? index) as string | number
}

const getItemValue = (item: T, key: string): unknown => {
    const obj = item as Record<string, unknown>
    return key.includes('.')
        ? key.split('.').reduce((acc, k) => (acc as Record<string, unknown>)?.[k], obj as unknown)
        : obj[key]
}
</script>