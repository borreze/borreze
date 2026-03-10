<template>
    <div>
        <Teleport to="#page-heading">
            <h1 class="title-main line-clamp-1">Mon profile</h1>
        </Teleport>

        <div v-if="auth.isAuthenticated">
            <p><strong>Email:</strong> {{ auth.user?.email }}</p>
            <p><strong>Username:</strong> {{ auth.user?.username }}</p>
            <p><strong>First Name:</strong> {{ auth.user?.first_name || '-' }}</p>
            <p><strong>Last Name:</strong> {{ auth.user?.last_name || '-' }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import Button from '~/components/atoms/Button.vue'

const auth = useAuthStore()

onMounted(() => {
    auth.fetchMe()
})

useAppHead({
    title: 'Profil',
})

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: true,
    title: 'Profil',
    private: true,
})

</script>
