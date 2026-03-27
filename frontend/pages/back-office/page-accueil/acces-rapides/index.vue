<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Accès rapides de l'accueil</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="md" />
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button as="link" href="/back-office/page-accueil/acces-rapides/ajouter" label="Ajouter"
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
                    { label: 'Ordre alphabétique', value: 'title:ASC' },
                    { label: 'Ordre alphabétique inverse', value: 'title:DESC' },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </div>

        <Table class="mt-4" :loading="loading" :items="homeQuicks" titleKey="title" descriptionKey="description"
            :columns="[
                { key: 'icon', label: 'Icon' },
                { key: 'title', label: 'Titre' },
                { key: 'url', label: 'URL' },
                { key: 'order', label: 'Ordre' },
                { key: 'is_visible', label: 'Visible' },
            ]" :actions="[
                { label: 'Modifier', icon: 'ic:baseline-edit', variant: 'primary', buildLink: (item) => `/back-office/page-accueil/acces-rapides/${item.id}` },
            ]">
            <template #cell-icon="{ item }">
                <div class="flex flex-wrap items-center gap-2">
                    <Icon :name="item.icon" size="2em" class="text-dark" />
                </div>
            </template>
            <template #cell-is_visible="{ item }">
                <div class="flex flex-wrap items-center gap-2">
                    <Pill size="sm" :label="item.is_visible ? 'Oui' : 'Non'"
                        :variant="item.is_visible ? 'success' : 'danger'" />
                </div>
            </template>
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
import { useHomeQuicks } from '~/composables/back-office/useHomeQuick';

const { homeQuicks, pagination, loading, setPage, setOrder, resetOrder, setSearch } = await useHomeQuicks()

const search = ref('')

watch(search, (newValue) => {
    setSearch(newValue)
})

useAppHead({
    title: 'Gestion des accès rapides'
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des accès rapides',
    private: true,
})

</script>