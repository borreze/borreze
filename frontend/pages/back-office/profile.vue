<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Mon profile</h1>
        </Teleport>

        <div v-if="authStore.isAuthenticated">
            <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
            <p><strong>Username:</strong> {{ authStore.user?.username }}</p>
            <p><strong>First Name:</strong> {{ authStore.user?.first_name || '-' }}</p>
            <p><strong>Last Name:</strong> {{ authStore.user?.last_name || '-' }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
    authStore.fetchMe()
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
