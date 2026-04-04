<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Galeries</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="md" />
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button v-if="authStore.canIDo('gallery', 'create')" as="link" href="/back-office/galeries/ajouter"
                label="Ajouter" icon="ic:baseline-plus" variant="primary" size="sm" />
        </Teleport>

        <div class="mt-4 flex gap-4 items-center justify-end ">
            <div class="max-w-xl flex gap-4 items-center">
                <Field v-model="search" placeholder="Rechercher..." icon="ic:baseline-search" size="sm" roundness="md"
                    class="flex-1" />
                <OrderBy class="flex-none" :orders="[
                    { label: 'Publiés récemment', value: 'published_at:DESC' },
                    { label: 'Publiés il y a longtemps', value: 'published_at:ASC' },
                    { label: 'Mise à jour récemment', value: 'updated_at:DESC' },
                    { label: 'Mise à jour il y a longtemps', value: 'updated_at:ASC' },
                    { label: 'Ordre alphabétique', value: 'name:ASC' },
                    { label: 'Ordre alphabétique inverse', value: 'name:DESC' },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </div>

        <Table class="mt-4" :loading="loading" :items="galleries" titleKey="name" descriptionKey="abstract" :columns="[
            { key: 'name', label: 'Nom' },
            { key: 'created_at', label: 'Créée le', formatter: 'date' },
        ]" :formatters="{
            date: (value) => value ? formatDateRelative(value as string) : '-'
        }" :actions="[
            ...(authStore.canIDo('gallery', 'read') ? [{ label: 'Modifier', icon: 'ic:baseline-edit', variant: 'primary' as ComponentVariant, buildLink: (item: GalleryAttributesFrontend) => `/back-office/galeries/${item.id}` }] : []),
        ]">
        </Table>
        <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />
    </div>
</template>

<script setup lang="ts">
import OrderBy from '~/components/organisms/OrderBy.vue';
import Paging from '~/components/molecules/Paging.vue';
import { useGalleries } from '~/composables/back-office/useGallery';
import Table from '~/components/organisms/back-office/Table.vue';
import Pill from '~/components/atoms/Pill.vue';
import Field from '~/components/atoms/Field.vue';
import { formatDateRelative } from '~/utils/date';
import { type GalleryAttributesFrontend } from '@brz/shared';
import Button from '~/components/atoms/Button.vue';
import type { ComponentVariant } from '~/types/component';
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const { galleries, pagination, loading, setPage, setOrder, resetOrder, setSearch } = await useGalleries()

const search = ref('')

watch(search, (newValue) => {
    setSearch(newValue)
})

useAppHead({
    title: 'Gestion des galeries',
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des galeries',
    private: true,
})

</script>