<template>
    <div>
        <div class="flex justify-between items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2">
                <h1 class="title-main">Actualités</h1>
                <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="sm" />
            </div>
            <div class="w-full sm:w-96 flex items-center gap-2">
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
            </div>
        </div>
        <div :class="['rounded-xl lg:p-6 mt-4', !isMobile() ? 'custom-shadow' : '']">
            <Table class="mt-4" :loading="loading" :items="posts" titleKey="title" :columns="[
                { key: 'id', label: 'ID', formatter: 'id' },
                { key: 'title', label: 'Titre' },
                { key: 'abstract', label: 'Résumé', formatter: 'truncate' },
                { key: 'published', label: 'Publié ?' },
                { key: 'published_at', label: 'Date de publication', formatter: 'date' },
                { key: 'updated_at', label: 'Mise à jour', formatter: 'date' },
            ]" :formatters="{
                id: (value) => `#${value}`,
                truncate: (value) => limitString(value as string, 40),
                date: (value) => value ? formatDateRelativeNice(value as string) : '-'
            }" :actions="[
                { label: 'Voir', icon: 'ic:outline-remove-red-eye', variant: 'ghost', handler: (item) => openInNewTab(`/actualites/${item.slug}`) },
                { label: 'Modifier', icon: 'ic:baseline-edit', variant: 'primary', handler: (item) => navigateTo(`/back-office/actualites/${item.id}`) },
            ]">
                <template #cell-published="{ item }">
                    <Pill :label="item.status === 'published' ? 'Oui' : 'Non'"
                        :variant="item.status === 'published' ? 'success' : 'warning'" size="sm" />
                </template>
            </Table>
            <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />
        </div>
    </div>
</template>

<script setup lang="ts">
import OrderBy from '~/components/organisms/OrderBy.vue';
import Paging from '~/components/molecules/Paging.vue';
import { usePosts } from '~/composables/back-office/usePost';
import Table from '~/components/organisms/back-office/Table.vue';
import Pill from '~/components/atoms/Pill.vue';
import Field from '~/components/atoms/Field.vue';
import { isMobile } from '#imports';

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