<template>
    <div class="flex items-center gap-2">
        <Button v-if="selectedOrder" variant="gray" size="sm" roundness="md" icon="ic:close" @click="handleReset" />
        <Dropdown v-model="selectedOrder" :items="ordersList" label-key="label" value-key="label" placeholder="Trier par"
            :variant="selectedOrder ? 'primary' : 'gray'" size="sm" :position="position" min-width-class="min-w-[200px]"
            @select="handleSelect" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '~/components/atoms/Button.vue'
import Dropdown from '~/components/molecules/Dropdown.vue'
import type { ComponentPosition } from '~/types/component';
import type { Order } from '~/types/order'

const props = withDefaults(defineProps<{
    orders?: { label: string, order: Order }[],
    position?: ComponentPosition
}>(), {
    orders: () => [
        { label: 'Plus récents', order: ['created_at', 'DESC'] },
        { label: 'Plus anciens', order: ['created_at', 'ASC'] },
    ],
    position: 'right',
})

const emit = defineEmits<{
    select: [order: Order]
    reset: []
}>()

const selectedOrder = ref<{ label: string, order: Order } | null>(null)

const ordersList = computed(() => props.orders || [])

function handleSelect(item: { label: string, order: Order }) {
    emit('select', item.order)
}

function handleReset() {
    selectedOrder.value = null
    emit('reset')
}
</script>