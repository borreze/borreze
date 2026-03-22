<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Utilisateurs</h1>
            <Pill v-if="pagination?.count" :label="pagination?.count" variant="light" size="md" />
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button as="link" href="/back-office/utilisateurs/ajouter" label="Ajouter" icon="ic:baseline-plus"
                variant="primary" size="sm" />
        </Teleport>

        <div class="mt-4 flex gap-4 items-center justify-end ">
            <div class="max-w-xl flex gap-4 items-center">
                <Field v-model="search" placeholder="Rechercher..." icon="ic:baseline-search" size="sm" roundness="md"
                    class="flex-1" />
                <OrderBy class="flex-none" :orders="[
                    { label: 'Mise à jour récemment', value: 'updated_at:DESC' },
                    { label: 'Mise à jour il y a longtemps', value: 'updated_at:ASC' },
                    { label: 'Ordre alphabétique', value: 'username:ASC' },
                    { label: 'Ordre alphabétique inverse', value: 'username:DESC' },
                ]" @select="setOrder" @reset="resetOrder" />
            </div>
        </div>

        <Table class="mt-4" :loading="loading" :items="users" titleKey="username" descriptionKey="description" :columns="[
            { key: 'id', label: 'ID', formatter: 'id' },
            { key: 'email', label: 'E-mail' },
            { key: 'username', label: 'Nom d\'utilisateur' },
            { key: 'role', label: 'Rôle' },
            { key: 'status', label: 'Statut' },
        ]" :formatters="{
            id: (value) => `#${value}`,
        }" :actions="[
            { label: 'Modifier', icon: 'ic:baseline-edit', variant: 'primary', buildLink: (item) => `/back-office/utilisateurs/${item.id}` },
        ]">
            <template #cell-role="{ item }">
                <div class="flex flex-wrap items-center gap-2">
                    <Pill :label="item.role?.name" variant="light" size="sm" />
                </div>
            </template>
            <template #cell-status="{ item }">
                <div class="flex flex-wrap items-center gap-2">
                    <Pill
                        :label="USER_STATUSES_OBJECTS.find(status => status.value === item.status)?.label || item.status"
                        :color="USER_STATUSES_OBJECTS.find(status => status.value === item.status)?.color" size="sm" />
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
import { useUsers } from '~/composables/back-office/useUser';
import { formatDate } from '~/utils/date';
import { USER_STATUSES_OBJECTS } from '@brz/shared';

const { users, pagination, loading, setPage, setOrder, resetOrder, setSearch } = await useUsers()

const search = ref('')

watch(search, (newValue) => {
    setSearch(newValue)
})

useAppHead({
    title: 'Gestion des utilisateurs'
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des utilisateurs',
    private: true,
})

</script>