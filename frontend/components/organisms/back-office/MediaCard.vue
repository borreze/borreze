<template>
    <div
        class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 shadow-[2px_2px_10px_2px_#0000001a] bg-white h-full">
        <!-- Preview zone with fixed aspect ratio -->
        <div class="relative aspect-square w-full overflow-hidden bg-gray-100">
            <img v-if="media.type === 'image'" :src="mediaUrl(media.file_path)" :alt="media.title"
                class="h-full w-full object-cover" loading="lazy" />
            <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
                <Icon :name="mediaGetIcon(media.type)" class="text-5xl" />
                <span class="text-xs uppercase tracking-wide">{{ mediaGetLabel(media.type) }}</span>
            </div>
        </div>

        <div class="flex flex-col gap-1 p-3 flex-1">
            <span class="text-sm font-medium text-gray-800 truncate"> {{ media.file_name }} </span>
            <span class="text-xs text-gray-400">{{ sizeToReadable(media.size) }}</span>
        </div>

        <div
            :class="[
                isMobile() ?
                    'flex-col justify-end p-3 gap-2' :
                    'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/10 bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity p-4']">
            <Button as="link" :href="mediaUrl(media.file_path)" target="_blank" variant="light" size="sm"
                icon="ic:baseline-open-in-new" label="Ouvrir" class="w-full mb-2" />
            <Button as="link" :href="`/back-office/medias/${media.id}`" variant="primary" size="sm"
                icon="ic:baseline-edit" label="Modifier" class="w-full" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { mediaGetIcon, mediaGetLabel, sizeToReadable, type MediaAttributes } from '@brz/shared'
import Button from '~/components/atoms/Button.vue';
import { mediaUrl } from '~/utils/media'
import { isMobile } from '~/utils/responsive';

const props = defineProps<{
    media: MediaAttributes
}>()

</script>