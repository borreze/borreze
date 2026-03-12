<template>
    <div class="flex items-center gap-2">
        <Button v-if="selectedOrder" variant="gray" size="sm" roundness="md" icon="ic:close" @click="handleReset" />
        <Dropdown v-model="selectedOrder" :items="ordersList" placeholder="Trier par"
            :variant="selectedOrder ? 'primary' : 'gray'" size="sm" :position="position" min-width-class="min-w-[200px]"
            @select="handleSelect" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '~/components/atoms/Button.vue'
import Dropdown from '~/components/molecules/Dropdown.vue'
import type { ComponentPosition } from '~/types/component'
import type { Order } from '~/types/order'

const props = withDefaults(defineProps<{
    orders?: { label: string, value: string }[]
    position?: ComponentPosition
}>(), {
    orders: () => [
        { label: 'Plus récents', value: 'created_at:DESC' },
        { label: 'Plus anciens', value: 'created_at:ASC' },
    ],
    position: 'right',
})

const emit = defineEmits<{
    select: [order: Order]
    reset: []
}>()

const selectedOrder = ref<string | null>(null)

const ordersList = computed(() => props.orders)

function parseOrder(value: string): Order {
    const [field, direction] = value.split(':')
    return [field, direction] as Order
}

function handleSelect(item: { label: string, value: string }) {
    emit('select', parseOrder(item.value))
}

function handleReset() {
    selectedOrder.value = null
    emit('reset')
}
</script>