<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Pages</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="md" />
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button v-if="authStore.canIDo('post', 'create')" as="link" href="/back-office/pages/ajouter"
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
                    { label: 'Ordre alphabétique', value: 'title:ASC' },
                    { label: 'Ordre alphabétique inverse', value: 'title:DESC' },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </div>

        <Table class="mt-4" :loading="loading" :items="posts" titleKey="title" descriptionKey="abstract" :columns="[
            { key: 'title', label: 'Titre' },
            { key: 'status', label: 'Status' },
            { key: 'published_at', label: 'Publication', formatter: 'date' },
        ]" :formatters="{
            date: (value) => value ? formatDateRelative(value as string) : '-'
        }" :actions="[
            { label: 'Voir', icon: 'ic:outline-remove-red-eye', variant: 'ghost' as ComponentVariant, buildLink: (item: PostAttributesFrontend) => `/pages/${item.slug}`, external: true },
            ...(authStore.canIDo('post', 'read') ? [{ label: 'Modifier', icon: 'ic:baseline-edit', variant: 'primary' as ComponentVariant, buildLink: (item: PostAttributesFrontend) => `/back-office/pages/${item.id}` }] : []),
        ]">
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
import { formatDateRelative } from '~/utils/date';
import { POST_STATUSES_OBJECTS, type PostAttributesFrontend } from '@brz/shared';
import Button from '~/components/atoms/Button.vue';
import type { ComponentVariant } from '~/types/component';
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const { posts, pagination, loading, setPage, setOrder, resetOrder, setSearch } = await usePosts('page')

const search = ref('')

watch(search, (newValue) => {
    setSearch(newValue)
})

useAppHead({
    title: 'Gestion des pages',
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des pages',
    private: true,
})

</script>