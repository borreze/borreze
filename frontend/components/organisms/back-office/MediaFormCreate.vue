<template>
    <div class="flex flex-col gap-6 2xl:gap-10 xl:flex-row">
        <div class="w-full space-y-8">
            <section
                class="w-full relative border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer"
                :class="isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'"
                @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
                @click="fileInputRef?.click()">
                <input ref="fileInputRef" type="file" multiple class="hidden" @change="handleFileInput" />
                <div class="flex flex-col items-center gap-3">
                    <Icon name="ic:baseline-cloud-upload" class="text-4xl text-gray-400" />
                    <p class="text-sm text-gray-600">
                        Glissez-déposez vos fichiers ici, ou
                        <button type="button" class="text-primary-600 underline cursor-pointer">
                            parcourir
                        </button>
                    </p>
                    <p class="text-xs text-gray-400">{{ sizeToReadable(MEDIA_UPLOAD_LIMIT, 0) }} max par fichier</p>
                </div>
            </section>

            <section>
                <ul v-if="pendingFiles.length" class="space-y-2">
                    <li v-for="(f, i) in pendingFiles" :key="i"
                        class="flex items-center justify-between p-3 bg-gray-50 rounded-md text-sm">
                        <div class="flex items-center gap-3 min-w-0">
                            <img v-if="f.preview" :src="f.preview" class="w-10 h-10 rounded object-cover shrink-0" />
                            <Icon v-else name="ic:baseline-insert-drive-file" class="text-xl text-gray-400 shrink-0" />
                            <span class="truncate">{{ f.file.name }}</span>
                            <span class="text-gray-400 shrink-0">{{ sizeToReadable(f.file.size) }}</span>
                        </div>
                        <button type="button" class="cursor-pointer text-red-500 hover:text-red-700"
                            @click="removePending(i)">
                            <Icon name="ic:baseline-close" size="1.5em" />
                        </button>
                    </li>
                </ul>
            </section>

            <div v-if="pendingFiles.length" class="flex items-center justify-end gap-4">
                <Button label="Envoyer" icon="ic:baseline-upload" variant="primary" size="sm" :loading="uploading"
                    :disabled="!pendingFiles.length" @click="handleUpload" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isTypeAllowed, MEDIA_UPLOAD_LIMIT, sizeToReadable, type MediaAttributes } from '@brz/shared'
import { push } from 'notivue';
import Button from '~/components/atoms/Button.vue';
import { useCreateMedia } from '~/composables/back-office/useMedia';

const props = withDefaults(defineProps<{
    initialMedia: MediaAttributes
    multiple?: boolean
}>(), {
    multiple: false
})

const emit = defineEmits<{
    uploaded: [medias: MediaAttributes[]]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading = ref(false)

const pendingFiles = ref<{ file: File, preview: string | null }[]>([])

const addFiles = (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
        if (file.size > MEDIA_UPLOAD_LIMIT) {
            push.error({ title: 'Erreur', message: `Le fichier "${file.name}" dépasse la limite de taille de ${sizeToReadable(MEDIA_UPLOAD_LIMIT, 0)}.` })
            continue
        }
        if (!isTypeAllowed(file.name, file.type)) {
            push.error({ title: 'Erreur', message: `Le fichier "${file.name}" n'est pas un type autorisé.` })
            continue
        }

        if (!props.multiple && pendingFiles.value.length > 0) {
            push.error({ title: 'Erreur', message: `Vous ne pouvez sélectionner qu'un seul fichier.` })
            break
        }

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