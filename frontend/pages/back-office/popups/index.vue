<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Popups d'alerte</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="md" />
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button as="link" href="/back-office/popups/ajouter" label="Ajouter" icon="ic:baseline-plus"
                variant="primary" size="sm" />
        </Teleport>

        <div class="mt-4 flex gap-4 items-center justify-end ">
            <div class="max-w-xl flex gap-4 items-center">
                <Field v-model="search" placeholder="Rechercher..." icon="ic:baseline-search" size="sm" roundness="md"
                    class="flex-1" />
                <OrderBy class="flex-none" :orders="[
                    { label: 'Mise à jour récemment', value: 'updated_at:DESC' },
                    { label: 'Mise à jour il y a longtemps', value: 'updated_at:ASC' },
                    { label: 'Ordre alphabétique', value: 'title:ASC' },
                    { label: 'Ordre alphabétique inverse', value: 'title:DESC' },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </div>

        <Table class="mt-4" :loading="loading" :items="popups" titleKey="title" descriptionKey="description" :columns="[
            { key: 'id', label: 'ID', formatter: 'id' },
            { key: 'title', label: 'Titre' },
            { key: 'date_from', label: 'Début', formatter: 'date' },
            { key: 'date_to', label: 'Fin', formatter: 'date' },
            { key: 'is_active', label: 'Visible' },
        ]" :formatters="{
            date: (value) => value ? formatDate(value as string) : '-',
            id: (value) => `#${value}`,
        }" :actions="[
                { label: 'Modifier', icon: 'ic:baseline-edit', variant: 'primary', buildLink: (item) => `/back-office/popups/${item.id}` },
            ]">
            <template #cell-is_active="{ item }">
                <div class="flex flex-wrap gap-1">
                    <Pill size="sm" :label="item.is_active ? 'Oui' : 'Non'"
                        :variant="item.is_active ? 'success' : 'danger'" />
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
import { usePopups } from '~/composables/back-office/usePopup';
import { formatDate } from '~/utils/date';

const { popups, pagination, loading, setPage, setOrder, resetOrder, setSearch } = await usePopups()

const search = ref('')

watch(search, (newValue) => {
    setSearch(newValue)
})

useAppHead({
    title: 'Gestion des popups'
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des popups',
    private: true,
})

</script>