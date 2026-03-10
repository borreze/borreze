<template>
    <div class="min-h-[calc(100vh-4rem)] overflow-hidden flex items-center justify-center">
        <div class="w-full max-w-md rounded-lg p-4 bg-white lg:shadow-[2px_2px_10px_2px_#0000001a]">
            <div class="flex items-center justify-center">
                <AppLogo to="/back-office" />
            </div>
            <h2 class="title-submain text-center mt-4 mb-8">
                {{ tabs[tab!].title }}
            </h2>
            <component :is="tabs[tab!].component" :setTab="setTab" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthLogin from '~/components/organisms/back-office/AuthLogin.vue'
import AuthForgot from '~/components/organisms/back-office/AuthForgot.vue'
import AuthReset from '~/components/organisms/back-office/AuthReset.vue'
import AppLogo from '~/components/organisms/AppLogo.vue'
import { isMobile } from '#imports'

type Tab = 'login' | 'forgot' | 'reset'

const tab = ref<Tab | null>('login')

const setTab = (to: Tab) => {
    tab.value = to
}

const tabs = ref<Record<Tab, { title: string, component: any }>>({
    login: {
        title: 'Se connecter',
        component: shallowRef(AuthLogin),
    },
    forgot: {
        title: 'Mot de passe oublié',
        component: shallowRef(AuthForgot),
    },
    reset: {
        title: 'Réinitialiser le mot de passe',
        component: shallowRef(AuthReset),
    }
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
