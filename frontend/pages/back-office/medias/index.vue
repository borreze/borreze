<template>
    <div>
        <Teleport to="#page-heading">
            <h1 class="title-main line-clamp-1">Médias</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="md" />
        </Teleport>
        <Teleport to="#page-actions">
            <Button label="Ajouter" icon="ic:baseline-plus" variant="primary" size="sm" @click="openAddModal" />
        </Teleport>

        <div class="mt-4 flex gap-4 items-center justify-end ">
            <div class="max-w-xl flex gap-4 items-center">
                <Field v-model="search" placeholder="Rechercher..." icon="ic:baseline-search" size="sm" roundness="md"
                    class="flex-1" />
                <OrderBy class="flex-none" :orders="[
                    { label: 'Mise à jour récemment', value: 'updated_at:DESC' },
                    { label: 'Mise à jour il y a longtemps', value: 'updated_at:ASC' },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </div>

        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <MediaCard v-for="media in medias" :key="media.id" :media="media" />
        </div>

        <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />

        <Modal v-model:open="addModal" title="Insérer une image" textCancel="Annuler" :onCancel="closeAddModal">
            <MediaForm :initial-media="defaultMedia" mode="create" @uploaded="handleUploaded" />
        </Modal>
    </div>
</template>

<script setup lang="ts">
import type { MediaAttributes } from '@brz/shared'
import MediaForm from '~/components/organisms/back-office/MediaForm.vue'
import { push } from 'notivue'
import Modal from '~/components/molecules/Modal.vue'
import OrderBy from '~/components/organisms/OrderBy.vue';
import Paging from '~/components/molecules/Paging.vue';
import { useMedias } from '~/composables/back-office/useMedia';
import Pill from '~/components/atoms/Pill.vue';
import Field from '~/components/atoms/Field.vue';
import Button from '~/components/atoms/Button.vue';
import MediaCard from '~/components/organisms/back-office/MediaCard.vue';

const { medias, pagination, setPage, setOrder, resetOrder, setSearch, refresh } = await useMedias()

const search = ref('')
const addModal = ref(false)
const defaultMedia: MediaAttributes = { id: 0, file_name: '', file_path: '', type: 'image', mime_type: '', size: 0, uploaded_by: null } // trick to satisfy types, will be ignored by backend

const handleUploaded = (medias: MediaAttributes[]) => {
    push.success({ title: 'Uploadé !', message: `${medias.length} fichier(s) ajouté(s).` })
    closeAddModal()
    refresh()
}

function openAddModal() {
    addModal.value = true
}

function closeAddModal() {
    addModal.value = false
}

watch(search, (newValue) => {
    setSearch(newValue)
})

useAppHead({
    title: 'Gestion des médias',
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des médias',
    private: true,
})

</script>