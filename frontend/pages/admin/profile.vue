<template>
    <div v-if="auth.isAuthenticated" class="safe-area max-w-3/4 mt-6 mx-auto bg-white rounded shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">Profile</h2>
        <p><strong>Email:</strong> {{ auth.user?.email }}</p>
        <p><strong>Username:</strong> {{ auth.user?.username }}</p>
        <p><strong>First Name:</strong> {{ auth.user?.first_name || '-' }}</p>
        <p><strong>Last Name:</strong> {{ auth.user?.last_name || '-' }}</p>
        <Button :label="'Logout'" variant="danger" size="md" class="mt-4" @click="auth.logout()" />
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import Button from '~/components/atoms/Button.vue'

const auth = useAuthStore()

definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
    requiresAuth: true,
        title: 'Profile',
        private: true,
})

</script>
