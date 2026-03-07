<template>
    <div>
        <div class="grid grid-cols-1 gap-6">
            <DashboradWelcome />
            <DashboradQuicks />
        </div>
    </div>
</template>

<script setup lang="ts">
import DashboradWelcome from '~/components/organisms/admin/DashboradWelcome.vue';
import DashboradQuicks from '~/components/organisms/admin/DashboradQuicks.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
    requiresAuth: true,
    title: 'Administration',
    private: true,
})

</script>