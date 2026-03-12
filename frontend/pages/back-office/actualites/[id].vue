<template>
    <div>
        <Teleport to="#page-heading">
            <h1 class="title-main line-clamp-1">{{ editingPost?.title }}</h1>
        </Teleport>
        <Teleport to="#page-actions">
            <Button label="Enregistrer" icon="ic:baseline-save" variant="primary" size="md" :loading="loading"
                @click="handleSave" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else-if="editingPost" class="flex flex-col gap-6 2xl:gap-10 xl:flex-row">
            <div class="w-full xl:w-9/12 space-y-12">
                <section>
                    <h4 class="title-submain mb-6">Informations générales</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <Field v-model="editingPost.title" label="Titre" hint="Titre principale de l'actualité"
                            roundness="md" />
                        <Field v-model="editingPost.slug" label="Slug"
                            hint="Identifiant unique de l'actualité, utilisé pour les URL" roundness="md" />
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-6">SEO</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <Field v-model="editingPost.meta_title" label="Meta title"
                            hint="Titre de la page pour les moteurs de recherches" roundness="md" />
                        <Field v-model="editingPost.meta_description" type="textarea" label="Meta description"
                            hint="Description de la page pour les moteurs de recherches" roundness="md" />
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-6">Publication</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <Datepicker v-model="editingPost.schedule_start" :with-time="true"
                            label="Date de début de publication" hint="Date à laquelle l'actualité sera publiée"
                            type="date" roundness="md" />
                        <Datepicker v-model="editingPost.schedule_end" :with-time="true"
                            label="Date de fin de publication" hint="Date à laquelle l'actualité ne sera plus publiée"
                            type="date" roundness="md" />
                        <Dropdown v-model="editingPost.status" variant="gray" size="md"
                            placeholder="Status de publication" :items="POST_STATUSES_WITH_LABELS" />
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-6">Contenu</h4>
                    <div class="space-y-4">
                        <Field v-model="editingPost.abstract" type="textarea" label="Résumé"
                            hint="Résumé de l'actualité, utilisé lors de l'affichage en liste" roundness="md" />
                        <WysiwygEditor v-model="editingPost.content" />
                    </div>
                </section>
            </div>
            <div class="px-auto xl:w-3/12">
                <div class="w-full mt-6 xl:mt-0 xl:sticky xl:top-5">
                    <h4 class="title-submain mb-6">Prévisualisation</h4>
                    <PostCard :post="editingPost" class="max-w-96" />
                </div>
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
import { POST_STATUSES_WITH_LABELS, type PostAttributes } from '~/types/backend/post'
import Datepicker from '~/components/atoms/Datepicker.vue';
import Dropdown from '~/components/molecules/Dropdown.vue';

const route = useRoute()
const { post, loading } = await usePost(route.params.id as unknown as number)

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Actualité introuvable' })
}

const editingPost = ref<PostAttributes>(post.value)

const handleSave = async () => {
    console.log('Enregistrement de l\'actualité...', editingPost.value)
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