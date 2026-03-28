<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Événements</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="md" />
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button as="link" href="/back-office/evenements/ajouter" label="Ajouter" icon="ic:baseline-plus"
                variant="primary" size="sm" />
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
                    { label: 'Ordre alphabétique', value: 'title:ASC' },
                    { label: 'Ordre alphabétique inverse', value: 'title:DESC' },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </div>

        <Table class="mt-4" :loading="loading" :items="posts" titleKey="title" descriptionKey="abstract" :columns="[
            { key: 'title', label: 'Titre' },
            { key: 'date_time', label: 'Date et heure', formatter: 'dateTime' },
            { key: 'categories', label: 'Catégories' },
            { key: 'status', label: 'Status' },
            { key: 'published_at', label: 'Publication', formatter: 'date' },
        ]" :formatters="{
            dateTime: (value) => value ? formatDateTime(value as string) : '-',
            date: (value) => value ? formatDateRelative(value as string) : '-'
        }" :actions="[
            { label: 'Voir', icon: 'ic:outline-remove-red-eye', variant: 'ghost', buildLink: (item) => `/evenements/${item.slug}`, external: true },
            { label: 'Modifier', icon: 'ic:baseline-edit', variant: 'primary', buildLink: (item) => `/back-office/evenements/${item.id}` },
        ]">
            <template #cell-categories="{ item }">
                <div class="flex flex-wrap items-center gap-2">
                    <Pill v-for="category in item.categories" :key="category.id" :label="category.name" variant="light"
                        size="sm" />
                </div>
            </template>
            <template #cell-status="{ item }">
                <div class="flex flex-wrap items-center gap-2">
                    <Pill
                        :label="POST_STATUSES_OBJECTS.find(status => status.value === item.status)?.label || item.status"
                        :color="POST_STATUSES_OBJECTS.find(status => status.value === item.status)?.color" size="sm" />
                </div>
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
import { formatDateRelative } from '~/utils/date';
import { POST_STATUSES_OBJECTS } from '@brz/shared';
import Button from '~/components/atoms/Button.vue';

const { posts, pagination, loading, setPage, setOrder, resetOrder, setSearch } = await usePosts('event')

const search = ref('')

watch(search, (newValue) => {
    setSearch(newValue)
})

useAppHead({
    title: 'Gestion des événements',
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des événements',
    private: true,
})

</script>