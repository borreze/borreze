<template>

    <div class="w-full flex flex-col gap-1">
        <div v-if="label || hint" class="flex justify-start flex-wrap items-end gap-2">
            <label v-if="label" class="text-sm font-medium text-dark">
                {{ label }}
                <span v-if="required" class="text-red-500">*</span>
            </label>
            <span v-if="hint" class="text-[11px] text-gray-400 pb-[1px]">
                {{ hint }}
            </span>
        </div>

        <div class="border-2 bg-white w-full border-gray-300 p-4 rounded-md">
            <Grid v-if="innerMedias && innerMedias.length > 0" :items="innerMedias" :min-width="150">
                <template #item="{ item }">
                    <MediaCard :media="item" :delete-button="true" :edit-button="false" :open-button="true"
                        :select-button="false" @delete="removeMedia(item.id)" />
                </template>
            </Grid>
            <div v-else class="text-gray-500 text-sm">
                Aucun média sélectionné
            </div>
            <div class="mt-4 flex gap-2">
                <MediaAddButton :multiple="multiple" :disabled="disabled" @uploaded="(medias) => addMedias(medias)" />
                <MediaPickButton :multiple="multiple" :disabled="disabled" @selected="(medias) => addMedias(medias)" />
            </div>
        </div>
        <p v-if="error" class="text-sm text-red-500 mt-1">
            {{ error }}
        </p>
    </div>
</template>


<script setup lang="ts">
import type { MediaAttributes } from '@brz/shared';
import MediaAddButton from '~/components/organisms/back-office/MediaAddButton.vue';
import MediaPickButton from '~/components/organisms/back-office/MediaPickButton.vue';
import MediaCard from './MediaCard.vue';
import Grid from '~/components/molecules/Grid.vue';

const props = withDefaults(defineProps<{
    modelValue?: MediaAttributes[] | null
    label?: string
    hint?: string
    required?: boolean
    multiple?: boolean
    error?: string | null
}>(), {
    label: 'Médias',
    hint: 'Sélectionnez des médias',
    multiple: false,
    required: false,
})

const innerMedias = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val as MediaAttributes[] | null)
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: MediaAttributes[] | null): void
}>()

function addMedias(medias: MediaAttributes[]) {
    const currentMedias = innerMedias.value ?? []
    innerMedias.value = [...currentMedias, ...medias]
}

function removeMedia(mediaId: number) {
    innerMedias.value = innerMedias.value?.filter(m => m.id !== mediaId) ?? null
}

const disabled = computed(() => {
    if (props.multiple) {
        return false
    }
    return (innerMedias.value && innerMedias.value.length > 0) || false
})

</script>