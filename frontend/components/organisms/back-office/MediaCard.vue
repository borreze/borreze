<template>
    <div
        :class="['z-10 group relative flex flex-col overflow-hidden rounded-lg border shadow-lg bg-white h-full', selected ? 'border-2 border-primary' : 'border-1 border-gray-200']">
        <MediaPicture :media="media" />

        <div class="flex flex-col gap-1 p-3 flex-1">
            <span class="text-sm font-medium text-gray-800 truncate"> {{ media.title }} </span>
            <span class="text-xs text-gray-400">{{ sizeToReadable(media.size) }}</span>
        </div>

        <div
            :class="[
                isMobile() ?
                    'flex-col justify-end p-3 gap-2' :
                    'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/30 bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity p-4']">
            <Button v-if="editButton" :disabled="disabled" as="link" :href="`/back-office/medias/${media.id}`"
                variant="primary" size="sm" icon="ic:baseline-edit" label="Modifier" class="w-full" />
            <Button v-if="openButton" :disabled="disabled" as="link" :href="mediaUrl(media.file_path)" target="_blank"
                variant="light" size="sm" icon="ic:baseline-open-in-new" label="Ouvrir" class="w-full mb-2" />
            <Button v-if="deleteButton" :disabled="disabled" variant="warning" size="sm" icon="ic:baseline-delete"
                label="Supprimer" class="w-full mb-2" @click="$emit('delete')" />
            <Button v-if="removeButton" :disabled="disabled" variant="warning" size="sm" icon="ic:round-close"
                label="Retirer" class="w-full mb-2" @click="$emit('remove')" />
            <Button v-if="toggleButton" :disabled="disabled" :variant="selected ? 'warning' : 'primary'" size="sm"
                :icon="selected ? 'ic:round-close' : 'ic:round-check'" :label="selected ? 'Retirer' : 'Sélectionner'" class="w-full mb-2" @click="$emit('toggle')" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { sizeToReadable, type MediaAttributes } from '@brz/shared'
import Button from '~/components/atoms/Button.vue';
import MediaPicture from '~/components/organisms/back-office/MediaPicture.vue';
import { mediaUrl } from '~/utils/media'
import { isMobile } from '~/utils/responsive';

const props = withDefaults(defineProps<{
    media: MediaAttributes
    disabled?: boolean
    selected?: boolean
    editButton?: boolean
    openButton?: boolean
    removeButton?: boolean
    deleteButton?: boolean
    toggleButton?: boolean
}>(), {
    disabled: false,
    editButton: true,
    openButton: true,
    removeButton: false,
    deleteButton: false,
    toggleButton: false
})

const emit = defineEmits<{
    (e: 'delete'): void
    (e: 'toggle'): void
    (e: 'remove'): void
}>()

</script>