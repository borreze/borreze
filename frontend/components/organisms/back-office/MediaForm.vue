<template>
    <div>
        <Teleport to="#page-heading">
            <h1 v-if="mode === 'edit'" class="title-main line-clamp-1">
                {{ `#${editingMedia.id}&nbsp;${editingMedia.file_name}` }}
            </h1>
        </Teleport>
        <Teleport to="#page-actions">
            <Button v-if="mode === 'edit'" label="Enregistrer" icon="ic:baseline-save" variant="primary" size="sm"
                :loading="loading" :disabled="hasErrors" @click="handleSave" />
            <Button v-if="mode === 'edit'" label="Supprimer" icon="ic:baseline-delete" variant="warning" size="sm"
                :loading="loading" @click="handleDelete" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="flex flex-col gap-6 2xl:gap-10 xl:flex-row">
            <div class="w-full xl:w-8/12 space-y-8">
                <!-- Upload zone (create only) -->
                <section v-if="mode === 'create'">
                    <div class="relative border-2 border-dashed rounded-lg p-10 text-center transition-colors"
                        :class="isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'"
                        @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                        @drop.prevent="handleDrop">
                        <input ref="fileInputRef" type="file" multiple class="hidden" @change="handleFileInput" />
                        <div class="flex flex-col items-center gap-3">
                            <Icon name="ic:baseline-cloud-upload" class="text-4xl text-gray-400" />
                            <p class="text-sm text-gray-600">
                                Glissez-déposez vos fichiers ici, ou
                                <button type="button" class="text-primary-600 underline" @click="fileInputRef?.click()">
                                    parcourir
                                </button>
                            </p>
                            <p class="text-xs text-gray-400">Images, PDF, vidéos, audio — 20 Mo max par fichier</p>
                        </div>
                    </div>

                    <!-- Pending files -->
                    <ul v-if="pendingFiles.length" class="mt-4 space-y-2">
                        <li v-for="(f, i) in pendingFiles" :key="i"
                            class="flex items-center justify-between p-3 bg-gray-50 rounded-md text-sm">
                            <div class="flex items-center gap-3 min-w-0">
                                <img v-if="f.preview" :src="f.preview"
                                    class="w-10 h-10 rounded object-cover shrink-0" />
                                <Icon v-else name="ic:baseline-insert-drive-file"
                                    class="text-xl text-gray-400 shrink-0" />
                                <span class="truncate">{{ f.file.name }}</span>
                                <span class="text-gray-400 shrink-0">{{ sizeToReadable(f.file.size) }}</span>
                            </div>
                            <button type="button" class="text-red-500 hover:text-red-700" @click="removePending(i)">
                                <Icon name="ic:baseline-close" />
                            </button>
                        </li>
                    </ul>

                    <div v-if="pendingFiles.length" class="mt-4 flex items-center gap-4">
                        <Button label="Uploader" icon="ic:baseline-upload" variant="primary" size="sm"
                            :loading="uploading" :disabled="!pendingFiles.length" @click="handleUpload" class="mt-4" />
                    </div>
                </section>

                <!-- Metadata (edit only) -->
                <section v-if="mode === 'edit'">
                    <h4 class="title-submain mb-6">Informations</h4>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingMedia.file_name" required label="Nom du fichier" roundness="md"
                                :error="errors.file_name" @blur="touch('file_name')" />
                        </div>
                        <div class="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div><strong>Type :</strong> {{ editingMedia.type }}</div>
                            <div><strong>MIME :</strong> {{ editingMedia.mime_type }}</div>
                            <div><strong>Taille :</strong> {{ sizeToReadable(editingMedia.size) }}</div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Preview sidebar (edit only) -->
            <div v-if="mode === 'edit'" class="xl:w-4/12">
                <div class="xl:sticky xl:top-5">
                    <h4 class="title-submain mb-4">Aperçu</h4>
                    <div v-if="editingMedia.type === 'image'" class="rounded-lg overflow-hidden border">
                        <img :src="mediaUrl(editingMedia.file_path)" :alt="editingMedia.file_name"
                            class="w-full h-auto object-contain max-h-96" />
                    </div>
                    <div v-else class="flex flex-col items-center gap-2 p-6 bg-gray-50 rounded-lg">
                        <Icon name="ic:baseline-insert-drive-file" class="text-5xl text-gray-400" />
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
import { sizeToReadable, type MediaAttributes } from '@brz/shared'
import Field from '~/components/atoms/Field.vue'
import Button from '~/components/atoms/Button.vue'
import Loader from '~/components/molecules/Loader.vue'
import { useCreateMedia } from '~/composables/back-office/useMedia';
import { mediaUrl } from '~/utils/media'

const props = withDefaults(defineProps<{
    initialMedia: MediaAttributes
    loading?: boolean
    mode: 'create' | 'edit'
}>(), {
    loading: false,
})

const emit = defineEmits<{
    save: [media: MediaAttributes]
    delete: []
    uploaded: [medias: MediaAttributes[]]
}>()

// --- Edit mode ---

const editingMedia = ref<MediaAttributes>({ ...props.initialMedia })

const { hasErrors, touch, errors, submit } = useForm(
    ['file_name'],
    {
        file_name: () => editingMedia.value.file_name === '' ? 'Le nom est requis' : null,
    }
)

const handleSave = () => submit(() => emit('save', editingMedia.value))
const handleDelete = () => emit('delete')

// --- Create mode (upload) ---

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading = ref(false)

interface PendingFile {
    file: File
    preview: string | null
}

const pendingFiles = ref<PendingFile[]>([])

const addFiles = (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
        const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        pendingFiles.value.push({ file, preview })
    }
}

const removePending = (index: number) => {
    const removed = pendingFiles.value.splice(index, 1)
    if (removed[0]?.preview) URL.revokeObjectURL(removed[0].preview)
}

const handleDrop = (e: DragEvent) => {
    isDragging.value = false
    if (e.dataTransfer?.files) addFiles(e.dataTransfer.files)
}

const handleFileInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    if (input.files) addFiles(input.files)
    input.value = '' // reset pour permettre re-sélection du même fichier
}

const handleUpload = async () => {
    uploading.value = true
    try {
        const { uploadMultiple } = useCreateMedia()
        const files = pendingFiles.value.map(p => p.file)
        const medias = await uploadMultiple(files)

        // Cleanup previews
        pendingFiles.value.forEach(p => { if (p.preview) URL.revokeObjectURL(p.preview) })
        pendingFiles.value = []

        emit('uploaded', medias)
    } finally {
        uploading.value = false
    }
}
</script>