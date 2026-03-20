<template>
    <div>
        <Button label="Ajouter" :disabled="disabled" icon="ic:baseline-plus" variant="primary" size="sm"
            @click="openAddModal" />

        <Modal v-model:open="modalOpen" title="Ajouter un média">
            <MediaFormCreate :multiple="multiple" :initial-media="defaultMedia" @uploaded="handleUploaded" />
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { type MediaAttributes } from '@brz/shared'
import MediaFormCreate from '~/components/organisms/back-office/MediaFormCreate.vue'
import { push } from 'notivue'
import Modal from '~/components/molecules/Modal.vue'
import Button from '~/components/atoms/Button.vue';

const props = withDefaults(defineProps<{
    disabled?: boolean
    multiple?: boolean
}>(), {
    disabled: false,
    multiple: false
})

const emit = defineEmits<{
    'uploaded': [medias: MediaAttributes[]]
}>()

const modalOpen = ref(false)
const defaultMedia: MediaAttributes = { id: 0, title: '', file_name: '', file_path: '', type: 'image', mime_type: '', size: 0, uploaded_by: null } // trick to satisfy types, will be ignored by backend

const handleUploaded = (medias: MediaAttributes[]) => {
    push.success({ title: 'Uploadé !', message: `${medias.length} fichier(s) ajouté(s).` })
    closeAddModal()
    emit('uploaded', medias)
}

function openAddModal() {
    modalOpen.value = true
}

function closeAddModal() {
    modalOpen.value = false
}

</script>