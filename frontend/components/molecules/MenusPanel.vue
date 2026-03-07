<template>
    <nav class="flex flex-col">
        <div v-for="menu in menus" :key="menu.id">
            <!-- No children -->
            <NuxtLink v-if="!menu.children || menu.children.length === 0" :to="menu.url || '#'"
                class="flex items-center justify-start px-4 py-3 text-lg font-medium text-dark" @click="close()">
                <Icon v-if="menu.icon" :name="menu.icon" size="1.2em" class="inline-block mr-2" />
                {{ menu.label }}
            </NuxtLink>

            <!-- With children -->
            <div v-else>
                <button @click="toggleMobileMenu(menu.id)"
                    class="w-full flex items-center justify-between px-4 py-3 text-lg font-medium text-dark">
                    <div class="flex items-center">
                        <Icon v-if="menu.icon" :name="menu.icon" size="1.2em" class="inline-block mr-2" />
                        {{ menu.label }}
                    </div>
                    <Icon name="ic:baseline-keyboard-arrow-down" size="1.2em"
                        :class="{ 'rotate-180': openMobileMenus.includes(menu.id) }" class="transition-transform" />
                </button>

                <Transition enter-active-class="transition-all duration-200" enter-from-class="max-h-0 opacity-0"
                    enter-to-class="max-h-96 opacity-100" leave-active-class="transition-all duration-200"
                    leave-from-class="max-h-96 opacity-100" leave-to-class="max-h-0 opacity-0">
                    <ul v-if="openMobileMenus.includes(menu.id)" class="overflow-hidden">
                        <li v-for="child in menu.children" :key="child.id">
                            <Button as="link" :label="child.label" :href="child.url || '#'"
                                :icon="child.icon || undefined" class="w-full text-left px-8 py-2.5 text-base"
                                variant="transparent" size="md" :center="false" @click="close()" />
                        </li>
                    </ul>
                </Transition>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { MenuAttributes } from '~/types/models/menu';
import Button from '~/components/atoms/Button.vue';

const props = defineProps<{
    menus: MenuAttributes[]
}>();

const emit = defineEmits<{
    'close': []
}>()

const close = () => {
    emit('close')
}

const openMobileMenus = ref<number[]>([]);

function toggleMobileMenu(menuId: number) {
    if (openMobileMenus.value.includes(menuId)) {
        openMobileMenus.value = openMobileMenus.value.filter(id => id !== menuId);
    } else {
        openMobileMenus.value.push(menuId);
    }
}
</script>