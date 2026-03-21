<template>
    <div class="grid grid-cols-1 gap-6">
        <DashboradWelcome />
        <hr class="hidden xl:block" />
        <DashboradQuicks />
    </div>
</template>

<script setup lang="ts">
import DashboradWelcome from '~/components/organisms/back-office/DashboradWelcome.vue';
import DashboradQuicks from '~/components/organisms/back-office/DashboradQuicks.vue';
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
    authStore.fetchMe()
})

useAppHead({
    title: 'Dashboard',
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: true,
    title: 'Dashboard',
    private: true,
})

</script>