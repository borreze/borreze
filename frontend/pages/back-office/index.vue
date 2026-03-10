<template>
    <div class="grid grid-cols-1 gap-6">
        <DashboradWelcome />
        <DashboradQuicks />
    </div>
</template>

<script setup lang="ts">
import DashboradWelcome from '~/components/organisms/back-office/DashboradWelcome.vue';
import DashboradQuicks from '~/components/organisms/back-office/DashboradQuicks.vue';

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