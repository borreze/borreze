<template>
    <div>
        <div class="flex justify-between items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2">
                <h1 class="title-main">{{ post?.title }}</h1>
            </div>
            <div class="flex items-center gap-2">
                <Button label="Retour" icon="ic:baseline-arrow-back" variant="ghost" size="md"
                    @click="navigateTo('/admin/actualites')" />
                <Button label="Enregistrer" icon="ic:baseline-save" variant="primary" size="md" :loading="loading"
                    @click="handleSave" />
            </div>
        </div>
        <section class="rounded-xl custom-shadow p-6 mt-4">
            <Loader v-if="loading" />
            <div v-else-if="post">
                {{ post }}
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { usePost } from '~/composables/admin/usePost';
import Field from '~/components/atoms/Field.vue';
import Button from '~/components/atoms/Button.vue';
import Loader from '~/components/molecules/Loader.vue';

const route = useRoute()
const { post, loading } = await usePost(route.params.id as unknown as number)

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Actualité introuvable' })
}

const handleSave = async () => {
    console.log('Enregistrement de l\'actualité...', post.value)
}

useAppHead({
    title: 'Gestion des actualités',
})

definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des actualités',
    private: true,
})


</script>