<template>
    <div v-if="dateTime" :class="['flex items-center gap-4 rounded-lg px-5 py-4', isInFuture(dateTime) ? 'bg-primary/5' : ' bg-gray-50']">
        <DateSquare :dateTime="dateTime" :color="isInFuture(dateTime) ? 'primary' : 'gray'" />
        <div class="text-sm text-gray-700">
            <div class="font-semibold">{{ formatDateRelative(dateTime, 'long') }}</div>
            <TimeText :dateTime="dateTime" />
        </div>
    </div>
</template>

<script setup lang="ts">
import DateSquare from '~/components/molecules/DateSquare.vue';
import TimeText from '~/components/molecules/TimeText.vue';

const props = defineProps<{
    dateTime: Date | string | null | undefined
}>()

</script>