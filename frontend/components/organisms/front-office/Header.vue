<template>
    <header class="sticky top-0 z-30 bg-white border-b-4 border-primary md:border-0 shadow-sm">
        <div class="mx-auto flex items-center justify-between px-4 md:px-8 py-3">
            <AppName to="/" />

            <!-- Mobile -->
            <div class="block md:hidden flex items-center gap-2">
                <Button class="hidden sm:flex flex-none" as="link" label="Contact" icon="ic:baseline-email"
                    href="/contact" variant="primary" size="sm" />
                <Button icon="ic:search" variant="ghost" size="lg" @click="searchOpened = !searchOpened" />
                <Button icon="ic:baseline-menu" variant="ghost" size="lg" @click="panelOpened = !panelOpened" />
            </div>

            <!-- Tablet -->
            <div class="flex-1 max-w-xl hidden md:flex lg:hidden w-1/2 flex items-center justify-end gap-2 md:gap-4">
                <Button class="flex-none" as="link" label="Com com" icon="material-symbols:castle"
                    href="https://www.paysdefenelon.fr/" target="_blank" variant="outline" size="sm" />
                <Button class="flex-none" as="link" label="Nous contacter" icon="ic:baseline-email" href="/contact"
                    variant="primary" size="sm" />
                <Button icon="ic:search" variant="ghost" size="lg" @click="searchOpened = !searchOpened" />
            </div>

            <!-- Desktop -->
            <div class="hidden lg:flex items-center gap-2">
                <Button class="flex-none" as="link" label="Communautés de communes" icon="material-symbols:castle"
                    href="https://www.paysdefenelon.fr/" target="_blank" variant="outline" size="md" />
                <Button class="flex-none" as="link" label="Nous contacter" icon="ic:baseline-email" href="/contact"
                    variant="primary" size="md" />
                <Button icon="ic:search" label="Rechercher..." variant="ghost" size="md"
                    @click="searchOpened = !searchOpened" />
            </div>
        </div>
    </header>

    <div class="top-0 z-20 hidden md:flex py-1 flex items-center justify-center bg-primary text-light shadow-sm">
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-full"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-full">
            <nav v-if="menuStore.menus['front-office']" class="flex items-center gap-8 text-lg font-medium">
                <div v-for="menu in menuStore.menus['front-office']" :key="menu.id" class="relative group">
                    <!-- No children -->
                    <NuxtLink v-if="!menu.children || menu.children.length === 0" :to="menu.url || '#'"
                        class="flex items-center justify-start py-2 hover:text-white transition-colors">
                        <Icon v-if="menu.icon" :name="menu.icon" size="1.2em" class="inline-block mr-2" />
                        {{ menu.label }}
                    </NuxtLink>

                    <!-- With children -->
                    <div v-else class="relative">
                        <button class="flex items-center gap-1 py-2 hover:text-white transition-colors">
                            <div class="flex items-center">
                                <Icon v-if="menu.icon" :name="menu.icon" size="1.2em" class="inline-block mr-2" />
                                {{ menu.label }}
                            </div>
                            <Icon name="ic:baseline-keyboard-arrow-down" size="1.2em"
                                class="transition-transform group-hover:rotate-180" />
                        </button>

                        <!-- Dropdown -->
                        <div
                            class="absolute top-full z-20 left-0 mt-1 w-56 bg-white shadow-lg rounded-b-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <ul class="py-2">
                                <li v-for="child in menu.children" :key="child.id">
                                    <Button as="link" :label="child.label" :href="child.url || '#'"
                                        variant="transparent" :icon="child.icon || undefined" size="md"
                                        :center="false" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </Transition>
    </div>

    <Panel v-model:open="panelOpened">
        <div class="flex flex-col gap-4 p-4">
            <Button as="link" label="Com com" icon="material-symbols:castle" href="https://www.paysdefenelon.fr/"
                variant="outline" size="md" />
            <Button as="link" label="Nous contacter" icon="ic:baseline-email" href="/contact" variant="primary"
                size="md" />
        </div>
        <div v-if="menuStore.menus['front-office']" class="px-2">
            <Menus :menus="menuStore.menus['front-office']" @close="panelOpened = false" />
        </div>
    </Panel>

    <Modal v-model:open="searchOpened" title="Rechercher" textConfirm="Rechercher" iconConfirm="ic:baseline-search" :onConfirm="handleSearch">
        <div class="sm:min-w-[300px] md:min-w-[400px]">
            <Field v-model="searchQuery" name="searchModal" type="search" placeholder="Entrez votre recherche..." />
        </div>
    </Modal>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue';
import Field from '~/components/atoms/Field.vue';
import Panel from '~/components/molecules/Panel.vue';
import Modal from '~/components/molecules/Modal.vue';
import AppName from '~/components/organisms/AppName.vue';
import Menus from '~/components/molecules/Menus.vue';
import { useMenuStore } from '~/stores/menu'

const menuStore = useMenuStore()

const panelOpened = ref(false)
const searchOpened = ref(false)
const searchQuery = ref('')

function handleSearch() {
    goToSearchPage(searchQuery.value)
}

function clearSearchInput() {
    searchQuery.value = ''
}

function focusSearchInput() {
    setTimeout(() => {
        const input = document.querySelector('input[name="searchModal"]') as HTMLInputElement | null
        if (input) {
            input.focus()
        }
    }, 200)
}

onMounted(() => {
    menuStore.loadMenus('front-office')
})

watch(searchOpened, (opened) => {
    if (opened) {
        clearSearchInput()
        focusSearchInput()
    }
})

</script>