<template>
    <div>
        <div class="flex justify-between items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2">
                <h1 class="title-main line-clamp-1">{{ post?.title }}</h1>
            </div>
            <div class="flex items-center gap-2">
                <Button label="Retour" icon="ic:baseline-arrow-back" variant="ghost" size="md"
                    @click="navigateTo('/back-office/actualites')" />
                <Button label="Enregistrer" icon="ic:baseline-save" variant="primary" size="md" :loading="loading"
                    @click="handleSave" />
            </div>
        </div>
        <div class="rounded-xl custom-shadow p-6 mt-4">
            <Loader v-if="loading" />
            <div v-else-if="post" class="space-y-12">
                <section>
                    <h4 class="title-submain mb-6">Informations générales</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <Field v-model="post.title" label="Titre" hint="Titre principale de l'actualité"
                            roundness="md" />
                        <Field v-model="post.slug" label="Slug"
                            hint="Identifiant unique de l'actualité, utilisé pour les URL" roundness="md" />
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-6">SEO</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <Field v-model="post.meta_title" label="Meta title"
                            hint="Titre de la page pour les moteurs de recherches" roundness="md" />
                        <Field v-model="post.meta_description" type="textarea" label="Meta description"
                            hint="Description de la page pour les moteurs de recherches" roundness="md" />
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-6">Contenu</h4>
                    <div class="space-y-4">
                        <Field v-model="post.abstract" type="textarea" label="Résumé"
                            hint="Résumé de l'actualité, utilisé lors de l'affichage en liste" roundness="md" />
                        <WysiwygEditor v-model="post.content" />
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePost } from '~/composables/back-office/usePost';
import Field from '~/components/atoms/Field.vue';
import Button from '~/components/atoms/Button.vue';
import Loader from '~/components/molecules/Loader.vue';
import WysiwygEditor from '~/components/organisms/back-office/WysiwygEditor.vue'
import PostCard from '~/components/organisms/front-office/PostCard.vue';

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
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Gestion des actualités',
    private: true,
})


</script>