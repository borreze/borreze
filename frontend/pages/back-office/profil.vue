<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">Mon profil</h1>
        </Teleport>

        <div v-if="authStore.isAuthenticated" class="w-full space-y-12">
            <section>
                <h4 class="title-submain mb-6">Informations générales</h4>
                <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
                <p><strong>Nom d'utilisateur:</strong> {{ authStore.user?.username }}</p>
                <p><strong>Prénom:</strong> {{ authStore.user?.first_name || '-' }}</p>
                <p><strong>Nom:</strong> {{ authStore.user?.last_name || '-' }}</p>
            </section>
            <section>
                <h4 class="title-submain mb-6">Informations techniques</h4>
                <p><strong>ID utilisateur:</strong> #{{ authStore.user?.id }}</p>
                <p><strong>ID Role:</strong> #{{ authStore.user?.role_id }}</p>
                <p><strong>Permissions:</strong> {{ authStore.user?.permissions.join(', ') || '-' }}</p>
                <p><strong>Permissions contextes:</strong> {{ getPermsContexts(authStore.user).join(', ') || '-' }}</p>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getPermsContexts } from '@brz/shared'
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
