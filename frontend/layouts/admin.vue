<template>
    <div>
        <Notivue v-slot="item">
            <Notification :item="item" />
        </Notivue>
        <header class="sticky lg:hidden top-0 z-30 bg-white shadow-sm">
            <div class="mx-auto flex items-center justify-between px-4 md:px-4 py-2">
                <AppName to="/admin" />

                <div class="flex items-center gap-2">
                    <Button icon="ic:baseline-menu" variant="ghost" size="lg" @click="panelOpened = !panelOpened" />
                </div>
            </div>
        </header>

        <div class="flex min-h-screen">
            <Panel v-model:open="panelOpened" :always-display="true" side="left">
                <div class="hidden lg:block px-4 py-8 flex">
                    <AppName to="/admin" />
                </div>
                <MenusPanel :menus="menus" @close="panelOpened = false" />
            </Panel>
            <main>
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Notivue, Notification } from 'notivue'
import type { MenuAttributes } from '~/types/models/menu';
import Button from '~/components/atoms/Button.vue';
import Panel from '~/components/molecules/Panel.vue';
import AppName from '~/components/organisms/AppName.vue';
import MenusPanel from '~/components/molecules/MenusPanel.vue';

const panelOpened = ref(false)

const menus = ref<MenuAttributes[]>([
    {
        id: 1,
        icon: 'ic:outline-laptop-windows',
        label: 'Front-office',
        url: '/',
        order: 0,
        is_visible: true,
    },
    {
        id: 2,
        icon: 'ic:baseline-person',
        label: 'Profil',
        url: '/admin/profile',
        order: 1,
        is_visible: true,
    },
    {
        id: 3,
        icon: 'ic:baseline-newspaper',
        label: 'Actualités',
        order: 1,
        is_visible: true,
        children: [
            {
                id: 4,
                label: 'Gérer les actualités',
                url: '/admin/actualites',
                order: 0,
                is_visible: true,
            },
            {
                id: 5,
                label: 'Gérer les catégories',
                url: '/admin/categories',
                order: 1,
                is_visible: true,
            },
        ],
    },
]);
</script>
