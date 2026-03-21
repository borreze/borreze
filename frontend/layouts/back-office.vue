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
                <Menus v-if="menuStore.menus['back-office']" :menus="menuStore.menus['back-office']"
                    @close="panelOpened = false" />
            </Panel>
            <div class="flex-1">
                <div class="flex items-center justify-between gap-4 mx-4 my-2 lg:pb-2 lg:border-b lg:border-gray-200">
                    <span class="font-medium text-gray-500">{{ hello() }} {{ authStore.user?.first_name }},</span>
                    <Button icon="ic:baseline-logout" variant="ghost" size="sm" @click="authStore.logout()" />
                </div>
                <main class="safe-area-sm">
                    <div class="flex justify-between items-center gap-4 flex-wrap mb-4">
                        <div class="flex items-center gap-4">
                            <Button v-if="!isInDashboard()" icon="ic:baseline-arrow-back" variant="ghost" size="md"
                                class="mt-2" @click="goBack()" />
                            <div id="page-heading" class="flex items-center gap-2" />
                        </div>
                        <div id="page-actions" class="flex items-center flex-wrap justify-end gap-2" />
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
import Button from '~/components/atoms/Button.vue';
import Panel from '~/components/molecules/Panel.vue';
import AppName from '~/components/organisms/AppName.vue';
import Menus from '~/components/molecules/Menus.vue';
import { useAuthStore } from '~/stores/auth'
import { useMenuStore } from '~/stores/menu'
import { goBack, isInDashboard } from '~/utils/routing';
import { hello } from '~/utils/text';

const authStore = useAuthStore()
const menuStore = useMenuStore()

const panelOpened = ref(false)

onMounted(() => {
    menuStore.loadMenus('back-office')
})

</script>

<style>
:root {
    --header-height: 0px !important;
}
</style>