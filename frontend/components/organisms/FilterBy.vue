<template>
    <div :class="['flex items-center gap-2 ', selected ? 'bg-gray-200 rounded-md' : '']">
        <Button v-if="selected" variant="gray" size="sm" roundness="md" icon="ic:close" @click="handleReset" />
        <Dropdown v-model="selected" :items="items" placeholder="Filtrer par" :variant="selected ? 'primary' : 'gray'"
            size="sm" :position="position" min-width-class="min-w-[200px]" @select="handleSelect" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '~/components/atoms/Button.vue'
import Dropdown from '~/components/molecules/Dropdown.vue'
import type { ComponentPosition } from '~/types/component'

const props = withDefaults(defineProps<{
    items?: { label: string, value: string }[]
    position?: ComponentPosition
}>(), {
    items: () => [],
    position: 'right',
})

const emit = defineEmits<{
    select: [item: { label: string, value: string }]
    reset: []
}>()

const selected = ref<string | null>(null)

function handleSelect(item: { label: string, value: string }) {
    emit('select', item)
}

function handleReset() {
    selected.value = null
    emit('reset')
}
</script>