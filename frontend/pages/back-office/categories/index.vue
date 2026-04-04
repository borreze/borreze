<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Catégories</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="md" />
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button v-if="authStore.canIDo('category', 'create')" as="link" href="/back-office/categories/ajouter" label="Ajouter"
                icon="ic:baseline-plus" variant="primary" size="sm" />
        </Teleport>

        <div class="mt-4 flex gap-4 items-center justify-end ">
            <div class="max-w-xl flex gap-4 items-center">
                <Field v-model="search" placeholder="Rechercher..." icon="ic:baseline-search" size="sm" roundness="md"
                    class="flex-1" />
                <OrderBy class="flex-none" :orders="[
                    { label: 'Ordre d\'affichage sur l\'accueil', value: 'order:ASC' },
                    { label: 'Mise à jour récemment', value: 'updated_at:DESC' },
                    { label: 'Mise à jour il y a longtemps', value: 'updated_at:ASC' },
                    { label: 'Ordre alphabétique', value: 'name:ASC' },
                    { label: 'Ordre alphabétique inverse', value: 'name:DESC' },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </div>

        <Table class="mt-4" :loading="loading" :items="categories" titleKey="name" descriptionKey="description"
            :columns="[
                { key: 'name', label: 'Nom' },
                { key: 'slug', label: 'Slug' },
            ]" :actions="[
                ...(authStore.canIDo('category', 'read') ? [{ label: 'Modifier', icon: 'ic:baseline-edit', variant: 'primary' as ComponentVariant, buildLink: (item: CategoryAttributes) => `/back-office/categories/${item.id}` }] : []),
            ]">
        </Table>
        <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />
    </div>
</template>

<script setup lang="ts">
import OrderBy from '~/components/organisms/OrderBy.vue';
import Paging from '~/components/molecules/Paging.vue';
import Table from '~/components/organisms/back-office/Table.vue';
import Pill from '~/components/atoms/Pill.vue';
import Field from '~/components/atoms/Field.vue';
import Button from '~/components/atoms/Button.vue';
import { useCategories } from '~/composables/back-office/useCategory';
import type { ComponentVariant } from '~/types/component';
import type { CategoryAttributes } from '@brz/shared';
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const { categories, pagination, loading, setPage, setOrder, resetOrder, setSearch } = await useCategories()

const search = ref('')

watch(search, (newValue) => {
    setSearch(newValue)
})

useAppHead({
    title: 'Gestion des catégories'
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des catégories',
    private: true,
})

</script>