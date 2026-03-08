<template>
    <div>
        <div class="flex justify-between items-center gap-4 flex-wrap">
            <h1 class="title-main">Actualités</h1>
            <OrderBy :orders="[
                { label: 'Publiés récemment', order: ['published_at', 'DESC'] },
                { label: 'Publiés il y a longtemps', order: ['published_at', 'ASC'] },
                { label: 'Mise à jour récemment', order: ['updated_at', 'DESC'] },
                { label: 'Mise à jour il y a longtemps', order: ['updated_at', 'ASC'] },
                { label: 'Ordre alphabétique', order: ['title', 'ASC'] },
                { label: 'Ordre alphabétique inverse', order: ['title', 'DESC'] },
            ]" @select="setOrder" @reset="resetOrder" />
        </div>
        <section class="rounded-xl lg:custom-shadow pb-1">
            <Table class="mt-4" :loading="loading" :items="posts" titleKey="title" :columns="[
                { key: 'title', label: 'Titre' },
                { key: 'abstract', label: 'Résumé', formatter: 'truncate' },
                { key: 'published', label: 'Publié ?' },
                { key: 'published_at', label: 'Date de publication', formatter: 'date' },
                { key: 'updated_at', label: 'Mise à jour', formatter: 'date' },
            ]" :formatters="{
                    truncate: (value) => limitString(value as string, 40),
                    date: (value) => value ? formatDateRelativeNice(value as string) : '-'
                }">
                <template #cell-published="{ item }">
                    <Pill :label="item.status === 'published' ? 'Oui' : 'Non'"
                        :variant="item.status === 'published' ? 'success' : 'warning'" size="sm" />
                </template>
            </Table>
            <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />
        </section>
    </div>
</template>

<script setup lang="ts">
import OrderBy from '~/components/organisms/site/OrderBy.vue';
import Paging from '~/components/molecules/Paging.vue';
import { usePosts } from '~/composables/admin/usePost';
import Table from '~/components/organisms/admin/Table.vue';
import Pill from '~/components/atoms/Pill.vue';

const { posts, pagination, loading, setPage, setOrder, resetOrder } = await usePosts()

useAppHead({
    title: 'Gestion des actualités',
})

definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des actualités',
    private: true,
})

</script>