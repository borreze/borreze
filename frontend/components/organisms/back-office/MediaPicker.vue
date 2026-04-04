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
            {{ hasReachedMax() ? 'Le nombre maximum de médias a été atteint pour ce champ.' : '' }}
        </p>

        <!-- Add modal -->
        <Modal v-model:open="addModal" :z-level="modalZLevel" title="Ajouter un média">
            <MediaFormCreate :multiple="multiple" :media-type="mediaType" @uploaded="handleUploaded" />
        </Modal>

        <!-- Pick modal -->
        <Modal v-model:open="pickModal" :z-level="modalZLevel" title="Séléctionner des médias">
            <div class="mb-4 max-w-lg">
                <Field v-model="search" placeholder="Rechercher..." icon="ic:baseline-search" size="sm" roundness="md"
                    class="flex-1" />
            </div>
            <!-- Picker medias grid -->
            <div class="h-[60vh] w-[80vw] md:w-[70vw] overflow-y-auto">
                <Loader v-if="loading" />
                <div v-else-if="medias" class="mt-6">
                    <Grid v-if="medias?.length > 0" :items="medias"
                        :layouts="{ default: 2, sm: 3, md: 3, lg: 4, xl: 5, '2xl': 6 }">
                        <template #item="{ item }">
                            <MediaCard :media="item" :disabled="disabled && !isSelected(item)" :delete-button="false"
                                :edit-button="false" :open-button="false" :toggle-button="true"
                                :selected="isSelected(item)" @toggle="toggleMedia(item)" />
                        </template>
                    </Grid>
                    <NoContent v-else message="Aucun média trouvé." />
                </div>
            </div>
            <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />
            <div class="flex justify-end gap-2">
                <Button :label="pickLabel" :disabled="!hasReachedMax()" icon="ic:round-check" variant="primary"
                    size="sm" @click="closePickModal" />
            </div>
        </Modal>
    </div>
</template>

<script setup lang="ts" generic="TMultiple extends boolean = false">
import type { MediaAttributes, MediaType } from '@brz/shared';
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
import type { ComponentZIndexLevel } from '~/types/component';

type PickerModelValue = TMultiple extends true ? MediaAttributes[] : MediaAttributes;

const props = withDefaults(defineProps<{
    modelValue?: PickerModelValue | null
    mediaType?: MediaType | null
    label?: string
    hint?: string
    required?: boolean
    multiple?: TMultiple
    error?: string | null
    warn?: string | null
    modalZLevel?: ComponentZIndexLevel
}>(), {
    label: 'Médias',
    hint: 'Sélectionnez des médias',
    required: false,
    modalZLevel: 1,
})

const isMultiple = computed(() => props.multiple ?? false)

const emit = defineEmits<{
    (e: 'update:modelValue', value: PickerModelValue | null): void
}>()

const { loading, medias, pagination, setPage, setSearch, refresh } = await useMedias({ type: (props.mediaType ?? 'all') })

const search = ref('')
const pickModal = ref(false)
const addModal = ref(false)

const innerMedias = computed({
    get: () => {
        if (!props.modelValue) return []
        return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
    },
    set: (val) => {
        if (isMultiple.value) {
            emit('update:modelValue', (val.length ? val : null) as PickerModelValue | null)
        } else {
            emit('update:modelValue', (val[0] ?? null) as PickerModelValue | null)
        }
    }
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
    return !isMultiple.value && innerMedias.value.length >= 1
}

const disabled = computed(() => {
    return hasReachedMax() || loading.value
})

const pickLabel = computed(() => {
    if (isMultiple.value) {
        return 'Choisir ces médias'
    } else {
        return 'Choisir ce média'
    }
})

// Watch for changes in modelValue to refresh the media list, so uploaded media can be unselected immediately
watch(() => props.modelValue, () => {
    refresh()
})

watch(search, (newValue) => {
    setSearch(newValue)
})


</script>