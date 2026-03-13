<template>
    <div class="flex items-center gap-2">
        <Pill v-for="category in categories" :key="category.id" clickable :label="category.name"
            :variant="selected?.includes(category.id) ? 'primary' : 'ghost'" size="md"
            @click="handleCategoryClick(category.id)" />
        <Pill v-if="selected && selected.length > 0" label="Tout" clickable variant="ghost" size="md" @click="handleReset" />
    </div>
</template>

<script setup lang="ts">
import Pill from '~/components/atoms/Pill.vue';
import type { CategoryAttributes } from '@brz/shared';

const props = defineProps<{
    categories?: CategoryAttributes[] | null,
    selected?: number[]
}>()

const emit = defineEmits<{
    remove: [category: number]
    add: [category: number]
    reset: []
}>()

function handleCategoryClick(categoryId: number) {
    if (props.selected?.includes(categoryId)) {
        emit('remove', categoryId)
    } else {
        emit('add', categoryId)
    }
}


function handleReset() {
    emit('reset')
}

</script>