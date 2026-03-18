<template>
    <div>
        <Teleport to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ `Media #${editingMedia.id}` }}
            </h1>
        </Teleport>
        <Teleport to="#page-actions">
            <Button label="Enregistrer" icon="ic:baseline-save" variant="primary" size="sm" :loading="loading"
                :disabled="hasErrors" @click="handleSave" />
            <Button label="Supprimer" icon="ic:baseline-delete" variant="warning" size="sm" :loading="loading"
                @click="handleDelete" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="flex flex-col gap-6 2xl:gap-10 xl:flex-row">
            <div class="w-full xl:w-9/12 space-y-12">
                <section>
                    <h4 class="title-submain mb-6">Informations</h4>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingMedia.title" required label="Titre du fichier" roundness="md"
                                :error="errors.title" @blur="touch('title')" />
                        </div>
                        <div class="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
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
                    <NuxtImg v-if="editingMedia.type === 'image'" :src="mediaUrl(editingMedia.file_path)"
                        :alt="editingMedia.title" class="w-full h-auto rounded-lg" />
                    <div v-else class="flex flex-col items-center gap-2 p-6 bg-gray-50 rounded-lg">
                        <Icon :name="mediaGetIcon(editingMedia.type)" class="text-5xl text-gray-400" />
                        <span class="text-sm text-gray-600">{{ editingMedia.file_name }}</span>
                    </div>
                    <a :href="mediaUrl(editingMedia.file_path)" target="_blank"
                        class="inline-block mt-3 text-sm text-primary-600 underline">
                        Ouvrir dans un nouvel onglet
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { mediaGetIcon, mediaGetLabel, sizeToReadable, type MediaAttributes } from '@brz/shared'
import Field from '~/components/atoms/Field.vue'
import Button from '~/components/atoms/Button.vue'
import Loader from '~/components/molecules/Loader.vue'
import { mediaUrl } from '~/utils/media'

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

const { hasErrors, touch, errors, submit } = useForm(
    ['title'],
    {
        title: () => editingMedia.value.title === '' ? 'Le nom est requis' : null,
    }
)

const handleSave = () => submit(() => {
    emit('save', editingMedia.value)
})


const handleDelete = () => {
    emit('delete')
}

</script>