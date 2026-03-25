<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ log ? `Journal d'activité #${log.id}&nbsp;` : '' }}
            </h1>
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="w-full space-y-12">
            <section>
                <h4 class="title-submain mb-6">Informations générales</h4>
                <p><strong>Contenu:</strong> {{ log?.message }}</p>
                <p><strong>Niveau:</strong> {{ log?.level }}</p>
                <p><strong>Date :</strong> {{ formatDateTime(log?.created_at) }}</p>
            </section>
            <section>
                <h4 class="title-submain mb-6">Informations techniques</h4>
                <p><strong>ID:</strong> #{{ log?.id }}</p>
                <p><strong>ID utilisateur:</strong> {{ log?.user_id ? `#${log.user_id}` : '-' }}</p>
                <p><strong>Adresse IP:</strong> {{ log?.ip_address || '-' }}</p>
                <p><strong>User agent:</strong> {{ log?.user_agent || '-' }}</p>
                <p><strong>Data:</strong> {{ log?.data }}</p>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDetailLog } from '~/composables/back-office/useLog'
import Loader from '~/components/molecules/Loader.vue'
import { formatDateTime } from '~/utils/date';

const route = useRoute()
const { log, loading } = await useDetailLog(route.params.id as unknown as number)

if (!log.value) {
    throw createError({ statusCode: 404, statusMessage: 'Log introuvable' })
}

useAppHead({ title: 'Modifier une log' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier une log',
    private: true,
})
</script>