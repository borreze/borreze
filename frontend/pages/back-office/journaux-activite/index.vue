<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Journaux d'activité</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="md" />
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button as="link" href="/back-office/journaux-activite/ajouter" label="Ajouter" icon="ic:baseline-plus"
                variant="primary" size="sm" />
        </Teleport>

        <div class="mt-4 flex gap-4 items-center justify-end ">
            <div class="max-w-xl flex gap-4 items-center">
                <Field v-model="search" placeholder="Rechercher..." icon="ic:baseline-search" size="sm" roundness="md"
                    class="flex-1" />
                <OrderBy class="flex-none" :orders="[
                    { label: 'Les plus récentes', value: 'created_at:DESC' },
                    { label: 'Les plus anciennes', value: 'created_at:ASC' },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </div>

        <Table class="mt-4" :loading="loading" :items="logs" titleKey="id" descriptionKey="message" :columns="[
            { key: 'id', label: 'ID', formatter: 'id' },
            { key: 'message', label: 'Contenu' },
            { key: 'level', label: 'Niveau de gravité' },
            { key: 'ip_address', label: 'Adresse IP' },
            { key: 'created_at', label: 'Date', formatter: 'date' },
        ]" :formatters="{
            date: (value) => value ? formatDateTime(value as string) : '-',
            id: (value) => `#${value}`,
        }" :actions="[
            { label: 'Consulter', icon: 'ic:outline-remove-red-eye', variant: 'primary', buildLink: (item) => `/back-office/journaux-activite/${item.id}` },
        ]">
            <template #cell-level="{ item }">
                <div class="flex flex-wrap items-center gap-2">
                    <Pill :label="LOG_LEVELS_OBJECTS.find(level => level.value === item.level)?.label || item.level"
                        :color="LOG_LEVELS_OBJECTS.find(level => level.value === item.level)?.color" size="sm" />
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
import { useLogs } from '~/composables/back-office/useLog';
import { formatDateTime } from '~/utils/date';
import { LOG_LEVELS_OBJECTS } from '@brz/shared';

const { logs, pagination, loading, setPage, setOrder, resetOrder, setSearch } = await useLogs()

const search = ref('')

watch(search, (newValue) => {
    setSearch(newValue)
})

useAppHead({
    title: 'Gestion des journaux d\'activité',
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des journaux d\'activité',
    private: true,
})

</script>