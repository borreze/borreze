<template>
    <div v-if="post"
        :class="['flex items-center gap-4 rounded-lg px-5 py-4', isInFuture(post.date_time) ? 'bg-primary/5' : ' bg-gray-50']">
        <DateSquare :dateTime="post.date_time" :color="isInFuture(post.date_time) ? 'primary' : 'gray'" />
        <div class="text-sm text-gray-700">
            <div class="font-semibold">{{ formatDateRelative(post.date_time, 'long') }}</div>
            <div v-if="post?.date_time || post?.address"
                class="mt-1 flex items-center gap-3 text-sm text-gray-500 flex-nowrap overflow-hidden">
                <span v-if="post?.date_time" class="flex items-center gap-1 shrink-0">
                    <Icon name="ic:outline-access-time" size="1em" />
                    {{ datetimeGetTime(post.date_time) }}
                </span>
                <span v-if="post?.address" class="flex items-center gap-1 min-w-0">
                    <Icon name="ic:outline-location-on" size="1em" class="shrink-0" />
                    <span class="truncate">{{ post.address }}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PostAttributesFrontend } from '@brz/shared';
import DateSquare from '~/components/molecules/DateSquare.vue';

const props = defineProps<{
    post?: PostAttributesFrontend | null
}>()

</script>