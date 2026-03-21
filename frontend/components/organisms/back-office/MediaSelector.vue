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

        <!-- Inner medias grid -->
        <div class="border-2 bg-white w-full border-gray-300 p-4 rounded-md">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <MediaCard v-for="media in innerMedias" :key="media.id" :media="media" :delete-button="false"
                    :edit-button="false" :open-button="true" :remove-button="true" :select-button="false"
                    @remove="removeMedia(media)" />
                <button
                    class="flex flex-col items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 transition-colors cursor-pointer"
                    :disabled="disabled" @click="openAddModal">
                    <Icon class="text-gray-300" name="ic:outline-file-upload" size="2em" />
                    <span class="text-sm text-gray-400">Envoyer depuis votre appareil</span>
                </button>
                <button
                    class="flex flex-col items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 transition-colors cursor-pointer"
                    :disabled="disabled" @click="openPickModal">
                    <Icon class="text-gray-300" name="ic:round-plus" size="2em" />
                    <span class="text-sm text-gray-400">Choisir dans la médiathèque</span>
                </button>
            </div>
        </div>
        <p v-if="error" class="text-sm text-danger mt-1">
            {{ error }}
        </p>
        <p v-if="warn" class="text-sm text-warning mt-1">
            {{ warn }}
        </p>

        <!-- Add modal -->
        <Modal v-model:open="addModal" title="Ajouter un média">
            <MediaFormCreate :multiple="multiple" @uploaded="handleUploaded" />
        </Modal>

        <!-- Pick modal -->
        <Modal v-model:open="pickModal" title="Séléctionner des médias" :max-width="1200">
            <div class="mb-4 max-w-lg">
                <Field v-model="search" placeholder="Rechercher..." icon="ic:baseline-search" size="sm" roundness="md"
                    class="flex-1" />
            </div>
            <!-- Picker medias grid -->
            <div class="h-[60vh] = min-w-[70vw] overflow-y-auto">
                <Loader v-if="loading" />
                <div v-else-if="medias" class="mt-6">
                    <Grid v-if="medias?.length > 0" :items="medias" :min-width="150">
                        <template #item="{ item }">
                            <MediaCard :media="item" :disabled="disabled && !isSelected(item)" :delete-button="false"
                                :edit-button="false" :open-button="false" :toggle-button="true"
                                :selected="isSelected(item)" @toggle="toggleMedia(item)" />
                        </template>
                    </Grid>
                    <NoContent v-else />
                </div>
            </div>
            <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />
            <div class="flex justify-end gap-2">
                <Button label="Utiliser ces médias" icon="ic:baseline-send" variant="primary" size="sm"
                    @click="closePickModal" />
            </div>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import type { MediaAttributes } from '@brz/shared';
import Grid from '~/components/molecules/Grid.vue';
import MediaFormCreate from './MediaFormCreate.vue';
import Modal from '~/components/molecules/Modal.vue';
import { push } from 'notivue';
import Button from '~/components/atoms/Button.vue';
import Paging from '~/components/molecules/Paging.vue';
import { useMedias } from '~/composables/back-office/useMedia';
import Field from '~/components/atoms/Field.vue';
import MediaCard from '~/components/organisms/back-office/MediaCard.vue';
import Loader from '~/components/molecules/Loader.vue';
import NoContent from '~/components/molecules/NoContent.vue';

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

const emit = defineEmits<{
    (e: 'update:modelValue', value: MediaAttributes[] | null): void
}>()

const { loading, medias, pagination, setPage, setSearch, refresh } = await useMedias()

const search = ref('')
const pickModal = ref(false)
const addModal = ref(false)

const innerMedias = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val as MediaAttributes[] | null)
})

function openAddModal() {
    addModal.value = true
}

function closeAddModal() {
    addModal.value = false
}

function openPickModal() {
    pickModal.value = true
}

function closePickModal() {
    pickModal.value = false
}

const handleUploaded = (medias: MediaAttributes[]) => {
    addMedias(medias)
    push.success({ title: 'Uploadé !', message: `${medias.length} fichier(s) ajouté(s).` })
    closeAddModal()
}

function isSelected(media: MediaAttributes): boolean {
    if (!innerMedias.value) return false
    return innerMedias.value.some(m => m.id === media.id)
}

function toggleMedia(media: MediaAttributes) {
    if (isSelected(media)) {
        removeMedia(media)
    } else {
        addMedias([media])
    }
}

function addMedias(medias: MediaAttributes[]) {
    const currentMedias = innerMedias.value ?? []
    innerMedias.value = [...currentMedias, ...medias]
}

function removeMedia(media: MediaAttributes) {
    if (!innerMedias.value) return
    innerMedias.value = innerMedias.value.filter(m => m.id !== media.id)
}

function hasReachedMax() {
    return (!props.multiple && innerMedias.value && innerMedias.value.length >= 1) || false
}

const disabled = computed(() => {
    return hasReachedMax() || loading.value
})

const warn = computed(() => {
    if (hasReachedMax()) {
        return 'Le nombre maximum de médias a été atteint.'
    }

    return null
})

// Watch for changes in modelValue to refresh the media list, so uploaded media can be unselected immediately
watch(() => props.modelValue, () => {
    refresh()
})

watch(search, (newValue) => {
    setSearch(newValue)
})


</script>