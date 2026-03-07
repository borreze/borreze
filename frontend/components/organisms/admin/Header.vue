<template>
    <header class="sticky top-0 z-30 bg-white border-b-4 border-primary  shadow-sm">
        <div class="mx-auto flex items-center justify-between px-4 md:px-8 py-4">
            <AppName to="/admin" />

            <div class="flex items-center gap-2">
                <Button icon="ic:baseline-menu" variant="ghost" size="lg" @click="panelOpened = !panelOpened" />
            </div>
        </div>
    </header>

    <Panel v-model:open="panelOpened" side="left">
        <MenusPanel :menus="menus" @close="panelOpened = false" />
    </Panel>
</template>

<script setup lang="ts">
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
]);
</script>