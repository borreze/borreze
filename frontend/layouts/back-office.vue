<template>
    <div>
        <header class="sticky lg:hidden top-0 z-30 bg-white shadow-sm">
            <div class="mx-auto flex items-center justify-between px-4 md:px-4 py-2">
                <AppName to="/back-office" />
                <div class="flex items-center gap-2">
                    <Button icon="ic:baseline-menu" variant="ghost" size="lg" @click="panelOpened = !panelOpened" />
                </div>
            </div>
        </header>

        <div class="flex min-h-screen">
            <Panel v-model:open="panelOpened" :always-display="true" side="left" :width="250">
                <div class="hidden lg:block px-4 pt-8 pb-4 flex">
                    <AppName to="/back-office" />
                </div>
                <MenusPanel :menus="menus" @close="panelOpened = false" />
            </Panel>
            <div class="flex-1">
                <div class="flex items-center justify-between gap-4 mx-4 my-2 lg:pb-2 lg:border-b lg:border-gray-200">
                    <span class="font-medium text-gray-500">Bonjour {{ auth.user?.first_name }},</span>
                    <Button icon="ic:baseline-logout" variant="ghost" size="sm" @click="auth.logout()" />
                </div>
                <main class="safe-area-sm">
                    <div class="flex justify-between items-center gap-4 flex-wrap mb-4">
                        <div class="flex items-center gap-4">
                            <Button icon="ic:baseline-arrow-back" variant="ghost" size="md" @click="goBack()" />
                            <div id="page-heading" class="flex items-center gap-2" />
                        </div>
                        <div id="page-actions" class="w-full sm:w-1/2 flex items-center justify-start gap-2" />
                    </div>

                    <div class="rounded-xl xl:p-6 mt-4 xl:shadow-[2px_2px_10px_2px_#0000001a]">
                        <slot />
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MenuAttributes } from '~/types/backend/menu';
import Button from '~/components/atoms/Button.vue';
import Panel from '~/components/molecules/Panel.vue';
import AppName from '~/components/organisms/AppName.vue';
import MenusPanel from '~/components/molecules/MenusPanel.vue';
import { useAuthStore } from '~/stores/auth'
import { isMobile } from '#imports';

const auth = useAuthStore()

const panelOpened = ref(false)

const menus = ref<MenuAttributes[]>([
    {
        id: 2,
        context: 'back-office',
        icon: 'ic:outline-space-dashboard',
        label: 'Dashboard',
        url: '/back-office',
        order: 0,
        is_visible: true,
    },
    {
        id: 3,
        context: 'back-office',
        icon: 'ic:baseline-person',
        label: 'Profil',
        url: '/back-office/profile',
        order: 1,
        is_visible: true,
    },
    {
        id: 4,
        context: 'back-office',
        icon: 'ic:baseline-newspaper',
        label: 'Actualités',
        order: 1,
        is_visible: true,
        children: [
            {
                id: 5,
                context: 'back-office',
                label: 'Liste des actualités',
                url: '/back-office/actualites',
                order: 0,
                is_visible: true,
            },
            {
                id: 6,
                context: 'back-office',
                label: 'Créer une actualité',
                url: '/back-office/actualites/ajouter',
                order: 1,
                is_visible: true,
            },
        ],
    },
]);
</script>
