<template>
    <div>
        <Teleport to="#page-heading">
            <h1 class="title-main line-clamp-1">Actualités</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="sm" />
        </Teleport>
        <Teleport to="#page-actions">
            <Field v-model="search" class="flex-1 min-w-0" placeholder="Rechercher..." icon="ic:baseline-search"
                size="sm" roundness="md" />
            <div class="shrink-0">
                <OrderBy :orders="[
                    { label: 'Publiés récemment', order: ['published_at', 'DESC'] },
                    { label: 'Publiés il y a longtemps', order: ['published_at', 'ASC'] },
                    { label: 'Mise à jour récemment', order: ['updated_at', 'DESC'] },
                    { label: 'Mise à jour il y a longtemps', order: ['updated_at', 'ASC'] },
                    { label: 'Ordre alphabétique', order: ['title', 'ASC'] },
                    { label: 'Ordre alphabétique inverse', order: ['title', 'DESC'] },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </Teleport>

        <Table class="mt-4" :loading="loading" :items="posts" titleKey="title" :columns="[
            { key: 'id', label: 'ID', formatter: 'id' },
            { key: 'title', label: 'Titre' },
            { key: 'abstract', label: 'Résumé', formatter: 'truncate' },
            { key: 'status', label: 'Status' },
            { key: 'published_at', label: 'Publication', formatter: 'date' },
            { key: 'updated_at', label: 'Màj', formatter: 'date' },
        ]" :formatters="{
            id: (value) => `#${value}`,
            truncate: (value) => limitString(value as string, 40),
            date: (value) => value ? formatDateRelativeNice(value as string) : '-'
        }" :actions="[
            { label: 'Voir', icon: 'ic:outline-remove-red-eye', variant: 'ghost', buildLink: (item) => `/actualites/${item.slug}`, external: true },
            { label: 'Modifier', icon: 'ic:baseline-edit', variant: 'primary', buildLink: (item) => `/back-office/actualites/${item.id}` },
        ]">
            <template #cell-status="{ item }">
                <Pill :label="POST_STATUSES_OBJECTS.find(status => status.value === item.status)?.label || item.status"
                    :color="POST_STATUSES_OBJECTS.find(status => status.value === item.status)?.color" size="sm" />
            </template>
        </Table>
        <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />
    </div>
</template>

<script setup lang="ts">
import OrderBy from '~/components/organisms/OrderBy.vue';
import Paging from '~/components/molecules/Paging.vue';
import { usePosts } from '~/composables/back-office/usePost';
import Table from '~/components/organisms/back-office/Table.vue';
import Pill from '~/components/atoms/Pill.vue';
import Field from '~/components/atoms/Field.vue';
import { limitString } from '~/utils/text';
import { formatDateRelativeNice } from '~/utils/date';
import { POST_STATUSES_OBJECTS } from '@brz/shared';

const { posts, pagination, loading, setPage, setOrder, resetOrder, setSearch } = await usePosts()

const search = ref('')

watch(search, (newValue) => {
    setSearch(newValue)
})

useAppHead({
    title: 'Gestion des actualités',
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des actualités',
    private: true,
})

</script>