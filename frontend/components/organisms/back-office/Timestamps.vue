<template>
    <div class="space-y-1 text-sm text-gray-600">
        <p><strong>Date de création:</strong>
            {{ formatDateTime(createdAt) }}</p>
        <p><strong>Date de dernière modification:</strong>
            {{ formatDateTime(updatedAt) }}</p>
    </div>
</template>

<script setup lang="ts">
import { formatDateRelative } from '~/utils/date';

defineProps<{
    createdAt?: string | Date | null
    updatedAt?: string | Date | null
}>()
</script>