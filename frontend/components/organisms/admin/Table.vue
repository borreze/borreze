<template>
    <div>
        <Loader v-if="loading" />
        <div v-else>
            <!-- Desktop -->
            <table class="hidden lg:table w-full">
                <thead v-if="items.length > 0">
                    <tr class="text-dark bg-white text-left font-bold">
                        <th v-for="column in columns" :key="column.key" class="py-1 xl:py-2 px-5 xl:px-7">{{
                            column.label }}</th>
                        <th v-if="actions && actions.length > 0">&nbsp;</th>
                    </tr>
                </thead>
                <tbody v-if="items.length > 0" class="text-sm 2xl:text-base">
                    <tr v-for="(item, index) in items" :key="getItemKey(item, index)"
                        :class="index % 2 === 0 ? 'bg-gray-100' : 'bg-transparent'">
                        <td v-for="column in columns" :key="column.key"
                            :class="['py-1 xl:py-2 px-5 xl:px-7', column.class || '']">
                            <slot :name="`cell-${column.key}`" :item="item" :value="getItemValue(item, column.key)">
                                <template v-if="column.formatter && formatters[column.formatter]">
                                    {{ formatters[column.formatter](getItemValue(item, column.key)) }}
                                </template>
                                <template v-else>
                                    {{ getItemValue(item, column.key) }}
                                </template>
                            </slot>
                        </td>
                        <td v-if="actions && actions.length > 0" class="py-1 xl:py-2 px-5 xl:px-7">
                            <div class="flex items-center gap-2">
                                <Button v-for="(action, aIndex) in actions" :key="aIndex"
                                    :variant="action.variant || 'light'" :icon="action.icon" size="sm"
                                    @click="action.handler(item)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td :colspan="columns.length + (actions?.length || 0)">
                            <NoContent />
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Mobile -->
            <div class="grid lg:hidden grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="(item, index) in items" :key="getItemKey(item, index)"
                    class="bg-white rounded-lg p-4 custom-shadow">
                    <div>
                        <h4 v-if="titleKey" class="mb-2 font-semibold text-dark">{{ getItemValue(item, titleKey) }}</h4>
                        <p v-if="abstractKey" class="mb-2 text-sm text-dark">{{ limitString(getItemValue(item, abstractKey) as string, 100) }}</p>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                            <div v-for="column in mobileVisibleColumns" :key="column.key"
                                class="flex flex-row gap-1 items-center">
                                <span class="font-medium">{{ column.label }}: </span>
                                <slot :name="`cell-${column.key}`" :item="item" :value="getItemValue(item, column.key)">
                                    <template v-if="column.formatter && formatters[column.formatter]">
                                        {{ formatters[column.formatter](getItemValue(item, column.key)) }}
                                    </template>
                                    <template v-else>
                                        {{ getItemValue(item, column.key) }}
                                    </template>
                                </slot>
                            </div>
                        </div>
                        <div v-if="actions && actions.length > 0" class="mt-4 flex items-center justify-end gap-2">
                            <Button v-for="(action, aIndex) in actions" :key="aIndex"
                                :variant="action.variant || 'light'" :icon="action.icon" :label="action.label" size="sm"
                                @click="action.handler(item)" />
                        </div>
                    </div>
                </div>
                <NoContent v-if="items.length === 0" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends object">
import Loader from '~/components/molecules/Loader.vue';
import NoContent from '~/components/molecules/NoContent.vue';
import type { ComponentVariant } from '~/types/component';
import Button from '~/components/atoms/Button.vue';

interface Column {
    key: string
    label: string
    class?: string
    formatter?: string
}

interface Action {
    icon: string
    label?: string
    variant?: ComponentVariant
    handler: (item: T) => void
}

type FormatterFn = (value: unknown) => string | number

const props = withDefaults(defineProps<{
    items: T[]
    columns: Column[]
    actions?: Action[]
    primaryKey?: string
    titleKey?: string
    abstractKey?: string
    loading?: boolean
    formatters?: Record<string, FormatterFn>
}>(), {
    primaryKey: 'id',
    titleKey: 'title',
    abstractKey: 'abstract',
    loading: false,
    formatters: () => ({})
})

defineSlots<{
    'mobile-action'(props: { item: T }): unknown
    [key: `cell-${string}`]: (props: { item: T; value: unknown }) => unknown
}>()

const mobileVisibleColumns = computed(() =>
    props.columns.filter(col =>
        col.key !== props.primaryKey &&
        col.key !== props.titleKey &&
        col.key !== props.abstractKey
    )
)

const getItemKey = (item: T, index: number): string | number => {
    const obj = item as Record<string, unknown>
    return (obj?.id ?? obj?.ref ?? obj?.[props.primaryKey ?? 'id'] ?? index) as string | number
}

const getItemValue = (item: T, key: string): unknown => {
    const obj = item as Record<string, unknown>
    return key.includes('.')
        ? key.split('.').reduce((acc, k) => (acc as Record<string, unknown>)?.[k], obj as unknown)
        : obj[key]
}
</script>