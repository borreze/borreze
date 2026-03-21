<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Médias</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="md" />
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button label="Ajouter" icon="ic:outline-file-upload" variant="primary" size="sm" @click="openAddModal" />
        </Teleport>

        <div class="mt-4 flex gap-4 items-center justify-end ">
            <div class="max-w-2xl flex gap-4 items-center flex-wrap md:flex-nowrap">
                <Field v-model="search" placeholder="Rechercher..." icon="ic:baseline-search" size="sm" roundness="md"
                    class="flex-1" />
                <FilterBy class="flex-none" :items="MEDIA_TYPES_OBJECTS"
                    @select="(item) => setType(item.value as MediaType)" @reset="resetType" />
                <OrderBy class="flex-none" :orders="[
                    { label: 'Mise à jour récemment', value: 'updated_at:DESC' },
                    { label: 'Mise à jour il y a longtemps', value: 'updated_at:ASC' },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </div>

        <Loader v-if="loading" />
        <div v-else-if="medias" class="mt-6">
            <Grid v-if="medias?.length > 0" :items="medias" :min-width="isMobile() ? null : 200">
                <template #item="{ item }">
                    <MediaCard :media="item" />
                </template>
            </Grid>
            <NoContent v-else />
        </div>

        <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />

        <Modal v-model:open="addModal" title="Ajouter un média">
            <MediaFormCreate :multiple="true" @uploaded="handleUploaded" />
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { MEDIA_TYPES_OBJECTS, type MediaAttributes, type MediaType } from '@brz/shared'
import FilterBy from '~/components/organisms/FilterBy.vue';
import Paging from '~/components/molecules/Paging.vue';
import { useMedias } from '~/composables/back-office/useMedia';
import Pill from '~/components/atoms/Pill.vue';
import Field from '~/components/atoms/Field.vue';
import MediaCard from '~/components/organisms/back-office/MediaCard.vue';
import Loader from '~/components/molecules/Loader.vue';
import NoContent from '~/components/molecules/NoContent.vue';
import Grid from '~/components/molecules/Grid.vue';
import { isMobile } from '~/utils/responsive';
import OrderBy from '~/components/organisms/OrderBy.vue';
import MediaFormCreate from '~/components/organisms/back-office/MediaFormCreate.vue';
import Modal from '~/components/molecules/Modal.vue';
import Button from '~/components/atoms/Button.vue';
import { push } from 'notivue';

const { loading, medias, pagination, setPage, setType, resetType, setOrder, resetOrder, setSearch, refresh } = await useMedias()

const search = ref('')
const addModal = ref(false)

function openAddModal() {
    addModal.value = true
}

function closeAddModal() {
    addModal.value = false
}

const handleUploaded = (medias: MediaAttributes[]) => {
    push.success({ title: 'Ajouté(s) !', message: `${medias.length} fichier(s) ajouté(s).` })
    closeAddModal()
    refresh()
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