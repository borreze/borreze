<template>
    <div>
        <Button label="Séléctionner" :disabled="disabled" icon="ic:baseline-plus" variant="ghost" size="sm"
            @click="openModal" />

        <Modal v-model:open="modalOpen" title="Séléctionner des médias" :max-width="1200">
            <div class="mb-4 max-w-lg">
                <Field v-model="search" placeholder="Rechercher..." icon="ic:baseline-search" size="sm" roundness="md"
                    class="flex-1" />
            </div>
            <div class="h-[60vh] = min-w-[70vw] overflow-y-auto">
                <Loader v-if="loading" />
                <div v-else-if="medias" class="mt-6">
                    <Grid v-if="medias?.length > 0" :items="medias" :min-width="150">
                        <template #item="{ item }">
                            <MediaCard :media="item" :disabled="hasReachedMaxSelection() && !isSelected(item.id)"
                                :delete-button="false" :edit-button="false" :open-button="false" :toggle-button="true"
                                :selected="isSelected(item.id)" @toggle="toggleMedia(item.id)" />
                        </template>
                    </Grid>
                    <NoContent v-else />
                </div>
            </div>
            <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />
            <div class="flex justify-end gap-2">
                <Button label="Utiliser ces médias" icon="ic:baseline-send" variant="primary" size="sm" @click="closeModal" />
            </div>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { type MediaAttributes } from '@brz/shared'
import Modal from '~/components/molecules/Modal.vue'
import Button from '~/components/atoms/Button.vue';
import Paging from '~/components/molecules/Paging.vue';
import { useMedias } from '~/composables/back-office/useMedia';
import Field from '~/components/atoms/Field.vue';
import MediaCard from '~/components/organisms/back-office/MediaCard.vue';
import Loader from '~/components/molecules/Loader.vue';
import NoContent from '~/components/molecules/NoContent.vue';
import Grid from '~/components/molecules/Grid.vue';

const props = withDefaults(defineProps<{
    modelValue?: MediaAttributes[] | null
    disabled?: boolean
    multiple?: boolean
}>(), {
    disabled: false,
    multiple: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: MediaAttributes[] | null): void
}>()

const { loading, medias, pagination, setPage, setSearch, refresh } = await useMedias()

const search = ref('')
const modalOpen = ref(false)

const innerMedias = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val as MediaAttributes[] | null)
})

function hasReachedMaxSelection() {
    return (!props.multiple && innerMedias.value && innerMedias.value.length >= 1) || false
}

function toggleMedia(mediaId: number) {
    if (isSelected(mediaId)) {
        removeMedia(mediaId)
    } else {
        addMedia(mediaId)
    }
}

function addMedia(mediaId: number) {
    const media = medias.value.find(m => m.id === mediaId)

    if (!innerMedias.value) innerMedias.value = []

    if (media && !isSelected(mediaId) && !hasReachedMaxSelection()) {
        innerMedias.value.push(media)
    }
}

function removeMedia(mediaId: number) {
    if (!innerMedias.value) return
    innerMedias.value = innerMedias.value.filter(m => m.id !== mediaId)
}

function isSelected(mediaId: number): boolean {
    if (!innerMedias.value) return false
    return innerMedias.value.some(m => m.id === mediaId)
}

function openModal() {
    modalOpen.value = true
}

function closeModal() {
    modalOpen.value = false
}

watch(search, (newValue) => {
    setSearch(newValue)
})

// Watch for changes in modelValue to refresh the media list, so uploaded media can be unselected immediately
watch(() => props.modelValue, () => {
    refresh()
})

</script>