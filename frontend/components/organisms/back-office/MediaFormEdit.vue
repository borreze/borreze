<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ editingMedia.title || `Media #${editingMedia.id}` }}
            </h1>
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button label="Ouvrir" icon="ic:baseline-open-in-new" as="link" :href="mediaUrl(editingMedia.file_path)"
                target="_blank" variant="light" size="sm" />
            <Button v-if="authStore.canIDo('media', 'update')" label="Enregistrer" icon="ic:baseline-save"
                variant="primary" size="sm" :loading="loading" :disabled="couldHaveErrors" @click="handleSave" />
            <Button v-if="authStore.canIDo('media', 'delete')" label="Supprimer" icon="ic:baseline-delete"
                variant="warning" size="sm" :loading="loading" @click="handleDelete" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="flex flex-col gap-6 2xl:gap-10 xl:flex-row">
            <div class="w-full xl:w-9/12 space-y-12">
                <section>
                    <h4 class="title-submain mb-6">Informations</h4>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingMedia.title" required label="Titre du fichier"
                                hint="Le nom du fichier tel qu'il apparaîtra dans la médiathèque" roundness="md"
                                :error="errors.title" @blur="touch('title')" />
                        </div>
                        <div class="grid grid-cols-1 gap-2 text-sm text-gray-600">
                            <div><strong>Type :</strong> {{ editingMedia.type }}</div>
                            <div><strong>MIME :</strong> {{ editingMedia.mime_type }}</div>
                            <div><strong>Taille :</strong> {{ sizeToReadable(editingMedia.size) }}</div>
                        </div>
                    </div>
                </section>
            </div>
            <div class="px-auto xl:w-3/12">
                <div class="w-full mt-6 xl:mt-0 xl:sticky xl:top-5">
                    <h4 class="title-submain mb-6">{{ mediaGetLabel(editingMedia.type) }}</h4>
                    <div
                        class="max-h-96 max-w-96 rounded-lg border border-gray-200 shadow-[2px_2px_10px_2px_#0000001a] overflow-hidden">
                        <MediaPicture :media="editingMedia" />
                    </div>
                    <div class="flex items-center justify-start gap-4 mt-4">
                        <Button label="Ouvrir" icon="ic:baseline-open-in-new" as="link"
                            :href="mediaUrl(editingMedia.file_path)" target="_blank" variant="light" size="sm" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MediaPicture from '~/components/organisms/back-office/MediaPicture.vue';
import { mediaGetLabel, sizeToReadable, type MediaAttributes } from '@brz/shared'
import Field from '~/components/atoms/Field.vue'
import Button from '~/components/atoms/Button.vue'
import Loader from '~/components/molecules/Loader.vue'
import { mediaUrl } from '~/utils/media'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const props = withDefaults(defineProps<{
    initialMedia: MediaAttributes
    loading?: boolean
}>(), {
    loading: false,
})

const emit = defineEmits<{
    save: [media: MediaAttributes]
    delete: []
}>()

const editingMedia = ref<MediaAttributes>({ ...props.initialMedia })

const { couldHaveErrors, touch, errors, submit } = useForm([
    { name: 'title', label: 'Nom', validation: () => editingMedia.value.title === '' ? 'Le nom est requis' : null },
])

const handleSave = () => submit(() => {
    emit('save', editingMedia.value)
})


const handleDelete = () => {
    emit('delete')
}

</script>