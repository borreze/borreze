<template>
    <div v-if="props.page && props.total && props.total > 1" class="flex justify-center items-center gap-4 m-8">
        <Button v-if="props.page > 1" icon="ic:baseline-chevron-left" variant="ghost" size="md"
            @click="emit('setPage', props.page - 1)" />
        <span v-else>&nbsp;</span>

        <!-- First page -->
        <Button v-if="props.page > 2" :label="1" variant="ghost" size="md" @click="emit('setPage', 1)" />
        <div v-if="props.page > 3">...</div>

        <!-- Previous page -->
        <Button v-if="props.page > 1" :label="props.page - 1" variant="ghost" size="md"
            @click="emit('setPage', props.page - 1)" />

        <!-- Current page -->
        <div class="text-primary font-semibold">{{ props.page }}</div>

        <!-- Next page -->
        <Button v-if="props.page < props.total" :label="props.page + 1" variant="ghost" size="md"
            @click="emit('setPage', props.page + 1)" />

        <!-- Last page -->
        <div v-if="props.page < props.total - 2">...</div>
        <Button v-if="props.page < props.total - 1" :label="props.total" variant="ghost" size="md"
            @click="emit('setPage', props.total)" />

        <Button v-if="props.page < props.total" icon="ic:baseline-chevron-right" variant="ghost" size="md"
            @click="emit('setPage', props.page + 1)" />
        <span v-else>&nbsp;</span>
    </div>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue';

const props = defineProps<{
    total?: number | null,
    page?: number | null,
}>()

const emit = defineEmits<{
    setPage: [page: number]
}>()
</script>