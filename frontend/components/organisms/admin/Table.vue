<template>
    <div :class="`bg-gray-300 p-2 sm:p-3 md:p-4 rounded-lg`">
        <div v-if="loading" class="bg-gray-300 p-4 rounded-lg">Chargement...</div>
        <div v-else-if="empty" class="bg-gray-300 p-4 rounded-lg">Aucun élément à afficher.</div>
        <div v-else>
            <!-- Desktop view -->
            <div class="hidden lg:block min-w-full overflow-hidden">
                <div class="text-dark bg-white text-left grid gap-4 px-4 py-4 rounded-lg font-semibold"
                    :style="{ gridTemplateColumns: gridCols }">
                    <div v-for="column in columns" :key="column.key">{{ column.label }}</div>
                </div>

                <div class="space-y-2 mt-2">
                    <router-link v-for="(item, index) in items" :key="getItemKey(item, index)" :to="getItemRoute(item)"
                        :class="index % 2 === 1 ? 'bg-white rounded-lg' : 'bg-transparent'"
                        class="grid gap-4 px-4 py-2 text-sm 2xl:text-base" :style="{ gridTemplateColumns: gridCols }">
                        <div v-for="column in columns" :key="column.key" :class="column.cellClass || ''">
                            <slot :name="`cell-${column.key}`" :item="item" :value="getItemValue(item, column.key)">
                                <template v-if="column.formatter && formatters[column.formatter]">
                                    {{ formatters[column.formatter](getItemValue(item, column.key)) }}
                                </template>
                                <template v-else>
                                    {{ getItemValue(item, column.key) }}
                                </template>
                            </slot>
                        </div>
                    </router-link>

                    <div v-if="items.length === 0" class="text-center px-4 py-4 text-gray-500 bg-white rounded-lg">
                        Aucun élément à afficher.
                    </div>
                </div>
            </div>

            <!-- Mobile view -->
            <div class="block lg:hidden space-y-3">
                <div v-for="(item, index) in items" :key="getItemKey(item, index)"
                    class="bg-white rounded-lg p-4 shadow-sm">
                    <router-link :to="getItemRoute(item)" class="block">
                        <div class="flex justify-between items-start mb-2">
                            <div class="font-semibold text-dark">{{ getItemValue(item, darkKey) }}</div>
                            <slot name="mobile-action" :item="item">
                            </slot>
                        </div>

                        <!-- dark key/subject -->
                        <div v-if="titleKey" class="text-sm text-gray-800 mb-2">{{ getItemValue(item, titleKey) }}</div>

                        <!-- Autres informations en grille -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                            <div v-for="column in mobileVisibleColumns" :key="column.key">
                                <span class="font-medium">{{ column.label }}:</span>
                                <span v-if="column.formatter && formatters[column.formatter]">
                                    {{ formatters[column.formatter](getItemValue(item, column.key)) }}
                                </span>
                                <span v-else>{{ getItemValue(item, column.key) }}</span>
                            </div>
                        </div>
                    </router-link>
                </div>

                <div v-if="items.length === 0" class="text-center px-4 py-8 text-gray-500 bg-white rounded-lg">
                    Aucun élément à afficher.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Column {
    key: string
    label: string
    cellClass?: string
    formatter?: string
    hiddenOnMobile?: boolean
}

type FormatterFn = (value: unknown) => string | number

const props = withDefaults(defineProps<{
    items: Record<string, unknown>[]
    columns: Column[]
    darkKey?: string
    titleKey?: string
    routePattern: string
    loading?: boolean
    empty?: boolean
    formatters?: Record<string, FormatterFn>
}>(), {
    darkKey: 'id',
    titleKey: 'subject',
    loading: false,
    empty: false,
    formatters: () => ({})
})

const gridCols = computed(() => {
    return `repeat(${props.columns.length}, minmax(0, 1fr))`
})

const mobileVisibleColumns = computed(() => {
    return props.columns.filter(col =>
        col.key !== props.darkKey &&
        col.key !== props.titleKey &&
        !col.hiddenOnMobile
    )
})

const getItemKey = (item: Record<string, unknown>, index: number): string | number => {
    return (item?.id || item?.ref || item?.[props.darkKey] || index) as string | number
}

const getItemValue = (item: Record<string, unknown>, key: string): unknown => {
    return key.includes('.')
        ? key.split('.').reduce((obj, k) => (obj as Record<string, unknown>)?.[k], item as unknown)
        : item[key]
}

const getItemRoute = (item: Record<string, unknown>): string => {
    const id = item.id || item[props.darkKey]
    return props.routePattern.replace('{id}', String(id))
}
</script>