<template>
    <div
        class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 shadow-[2px_2px_10px_2px_#0000001a] bg-white h-full">
        <MediaPreview :media="media" />

        <div class="flex flex-col gap-1 p-3 flex-1">
            <span class="text-sm font-medium text-gray-800 truncate"> {{ media.title }} </span>
            <span class="text-xs text-gray-400">{{ sizeToReadable(media.size) }}</span>
        </div>

        <div
            :class="[
                isMobile() ?
                    'flex-col justify-end p-3 gap-2' :
                    'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/30 bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity p-4']">
            <Button as="link" :href="`/back-office/medias/${media.id}`" variant="primary" size="sm"
                icon="ic:baseline-edit" label="Modifier" class="w-full" />
            <Button as="link" :href="mediaUrl(media.file_path)" target="_blank" variant="light" size="sm"
                icon="ic:baseline-open-in-new" label="Ouvrir" class="w-full mb-2" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { sizeToReadable, type MediaAttributes } from '@brz/shared'
import Button from '~/components/atoms/Button.vue';
import MediaPreview from '~/components/organisms/back-office/MediaPreview.vue';
import { mediaUrl } from '~/utils/media'
import { isMobile } from '~/utils/responsive';

const props = defineProps<{
    media: MediaAttributes
}>()

</script>