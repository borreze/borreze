<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ editingGallery.name || (mode === 'create' ? 'Nouvelle galerie' : '') }}
            </h1>
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button v-if="authStore.canIDo('gallery', 'update')" label="Enregistrer" icon="ic:baseline-save"
                variant="primary" size="sm" :loading="loading" :disabled="couldHaveErrors" @click="handleSave" />
            <Button v-if="authStore.canIDo('gallery', 'delete') && mode === 'edit'" label="Supprimer"
                icon="ic:baseline-delete" variant="warning" size="sm" :loading="loading" @click="handleDelete" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="flex flex-col gap-6 2xl:gap-10">
            <div class="w-full space-y-12">
                <section>
                    <h4 class="title-submain mb-6">Informations générales</h4>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingGallery.name" required label="Titre" hint="Titre principale"
                                roundness="md" :error="errors.name" @blur="touch('name')" />
                        </div>
                        <div>
                            <MediaPicker v-model="editingGalleryPhotos" :multiple="true" required label="Photos"
                                hint="Sélectionnez les photos à inclure dans cette galerie" :error="errors.photos"
                                @change="touch('photos')" />
                        </div>
                    </div>
                </section>
                <section v-if="mode === 'edit'">
                    <Timestamps :created-at="editingGallery.created_at" :updated-at="editingGallery.updated_at" />
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GalleryAttributesFrontend, MediaAttributes } from '@brz/shared'
import Field from '~/components/atoms/Field.vue'
import Button from '~/components/atoms/Button.vue'
import Loader from '~/components/molecules/Loader.vue'
import Timestamps from './Timestamps.vue'
import { useAuthStore } from '~/stores/auth'
import MediaPicker from './MediaPicker.vue'

const authStore = useAuthStore()

const props = withDefaults(defineProps<{
    initialGallery: GalleryAttributesFrontend
    loading?: boolean
    mode: 'create' | 'edit'
}>(), {
    loading: false,
})

const emit = defineEmits<{
    save: [gallery: GalleryAttributesFrontend, photoIds: number[]]
    delete: []
}>()

const editingGallery = ref<GalleryAttributesFrontend>({ ...props.initialGallery })

const editingGalleryPhotos = computed({
    get: () => editingGallery.value.photos ?? [],
    set: (newValue: MediaAttributes[]) => { editingGallery.value.photos = newValue },
})

const { errorLabels, hasErrors, couldHaveErrors, touch, errors, submit } = useForm([
    { name: 'name', label: 'Nom', validation: () => editingGallery.value.name === '' ? 'Le nom est requis' : null },
    { name: 'photos', label: 'Photos', validation: () => editingGalleryPhotos.value.length === 0 ? 'Au moins une photo doit être sélectionnée' : null },
])

const handleSave = () => submit(() => {
    const photoIds = editingGalleryPhotos.value.map(p => p.id)

    if (editingGallery.value.photos) { // remove photos array to avoid creating new photos
        delete editingGallery.value.photos
    }
    emit('save', editingGallery.value, photoIds)
})


const handleDelete = () => {
    emit('delete')
}
</script>