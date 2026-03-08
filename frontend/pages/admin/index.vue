<template>
    <div class="grid grid-cols-1 gap-6">
        <DashboradWelcome />
        <DashboradQuicks />
    </div>
</template>

<script setup lang="ts">
import DashboradWelcome from '~/components/organisms/admin/DashboradWelcome.vue';
import DashboradQuicks from '~/components/organisms/admin/DashboradQuicks.vue';

useAppHead({
    title: 'Dashboard',
})

definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
    requiresAuth: true,
    title: 'Dashboard',
    private: true,
})

</script>