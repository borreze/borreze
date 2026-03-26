<template>
    <div class="relative p-4 flex items-center justify-center md:min-h-screen">
        <NuxtImg
            src="/photos/borreze-centre.webp"
            :quality="80"
            fit="cover"
            class="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
        />
        <div class="absolute inset-0 bg-dark/10" />

        <div class="relative z-10 w-full max-w-md rounded-lg p-4 bg-white shadow-[2px_2px_10px_2px_#0000001a]">
            <div class="flex items-center justify-center">
                <AppLogo to="/back-office" />
            </div>
            <h2 class="title-submain text-center mt-4 mb-4">
                {{ tabs[tab!].title }}
            </h2>
            <p class="text-center text-sm font-semibold text-gray-500 mb-6">{{ tabs[tab!].description }}</p>
            <component :is="tabs[tab!].component" :setTab="setTab" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthLogin from '~/components/organisms/back-office/AuthLogin.vue'
import AppLogo from '~/components/organisms/AppLogo.vue'

type Tab = 'login' 

const tab = ref<Tab | null>('login')

const setTab = (to: Tab) => {
    tab.value = to
}

const tabs = ref<Record<Tab, { title: string, description: string, component: any }>>({
    login: {
        title: 'Se connecter',
        description: 'Connectez-vous à votre back-office pour gérer et administrer votre site web en toute simplicité',
        component: shallowRef(AuthLogin),
    },
})

useAppHead({
    title: 'Authentification',
})

definePageMeta({
    layout: 'blank',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Authentification',
    private: true,
})

</script>
