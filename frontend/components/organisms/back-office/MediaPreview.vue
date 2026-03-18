<template>
    <div class="relative aspect-square w-full overflow-hidden bg-gray-100">
        <NuxtImg v-if="media.type === 'image'" :src="mediaUrl(media.file_path)" :alt="media.title"
            class="h-full w-full object-cover" loading="lazy" />
        <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
            <Icon :name="mediaGetIcon(media.type)" class="text-5xl" />
            <span class="text-xs uppercase tracking-wide">{{ mediaGetLabel(media.type) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { mediaGetIcon, mediaGetLabel, type MediaAttributes } from '@brz/shared'
import { mediaUrl } from '~/utils/media'

const props = defineProps<{
    media: MediaAttributes
}>()

</script>