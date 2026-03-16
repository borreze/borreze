<template>
    <div>
        <Teleport to="#page-heading">
            <h1 class="title-main line-clamp-1">{{ editingPost?.title }}</h1>
        </Teleport>
        <Teleport to="#page-actions">
            <Button label="Enregistrer" icon="ic:baseline-save" variant="primary" size="md" :loading="loading"
                :disabled="hasErrors" @click="handleSave" />
            <Button label="Publier" icon="ic:baseline-publish" variant="outline" size="md" :loading="loading"
                :disabled="editingPost?.status === 'published'"
                :title="editingPost?.status === 'published' ? 'L\'actualité est déjà publiée' : 'Publier l\'actualité'"
                @click="handlePublish" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else-if="editingPost" class="flex flex-col gap-6 2xl:gap-10 xl:flex-row">
            <div class="w-full xl:w-9/12 space-y-12">
                <section>
                    <h4 class="title-submain mb-6">Informations générales</h4>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingPost.title" required label="Titre"
                                hint="Titre principale de l'actualité" roundness="md" :error="errors.title"
                                @blur="touch('title')" />
                            <Field v-model="editingPost.slug" required label="Slug"
                                hint="Identifiant unique de l'actualité, utilisé pour les URL" roundness="md"
                                :error="errors.slug" @blur="touch('slug')" />
                        </div>
                        <Field v-model="editingPost.abstract" type="textarea" label="Résumé"
                            hint="Résumé de l'actualité, utilisé lors de l'affichage en liste" roundness="md"
                            :error="errors.abstract" @blur="touch('abstract')" />
                        <div class="max-w-xs">
                            <Dropdown v-model="editingPostCategories" variant="light" size="md" label="Catégories"
                                placeholder="Aucune" label-key="name" value-key="id" multiple :items="categories" />
                        </div>
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-4">Publication</h4>
                    <p class="hint mb-2">
                        Ne saisissez pas de date de début et de fin si vous souhaitez que l'actualité soit publiée
                        immédiatement et indéfiniment.<br>
                        Si vous saisissez une date de début dans le futur, l'actualité sera programmée pour être publiée
                        à cette date.<br>
                        Si vous saisissez une date de fin, l'actualité sera retirée de la publication à cette date. <br>
                        Dans tout les cas, le status de publication doit être défini à "Publié" pour que l'actualité
                        soit visible sur le site, même si les dates sont correctement remplies.
                    </p>
                    <div class="flex flex-row flex-wrap gap-4">
                        <div class="max-w-xs">
                            <Datepicker v-model="editingPost.schedule_start" :with-time="true"
                                label="Date de début de publication" type="date" roundness="md"
                                :error="errors.schedule_start" @blur="touch('schedule_start')" />
                        </div>
                        <div class="max-w-xs">
                            <Datepicker v-model="editingPost.schedule_end" :with-time="true"
                                label="Date de fin de publication" type="date" roundness="md"
                                :error="errors.schedule_end" @blur="touch('schedule_end')" />
                        </div>
                        <div class="max-w-xs">
                            <Dropdown v-model="editingPost.status" variant="light" size="md"
                                label="Status de publication" placeholder="Status de publication"
                                :items="POST_STATUSES_OBJECTS" @close="touch('status')" />
                        </div>
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-6">SEO</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <Field v-model="editingPost.meta_title" label="Meta title"
                            hint="Titre de la page pour les moteurs de recherches" roundness="md"
                            :error="errors.meta_title" @blur="touch('meta_title')" />
                        <Field v-model="editingPost.meta_description" type="textarea" label="Meta description"
                            hint="Description de la page pour les moteurs de recherches" roundness="md"
                            :error="errors.meta_description" @blur="touch('meta_description')" />
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-6">Contenu</h4>
                    <div>
                        <WysiwygEditor v-model="editingPost.content" :error="errors.content" @blur="touch('content')" />
                    </div>
                </section>
            </div>
            <div class="px-auto xl:w-3/12">
                <div class="w-full mt-6 xl:mt-0 xl:sticky xl:top-5">
                    <h4 class="title-submain mb-6">Prévisualisation</h4>
                    <PostCard :clickable="false" :post="editingPost" class="max-w-96" />
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
import { POST_STATUSES_OBJECTS } from '@brz/shared';
import type { PostAttributesFrontend } from '@brz/shared';
import Datepicker from '~/components/atoms/Datepicker.vue';
import Dropdown from '~/components/molecules/Dropdown.vue';
import { slugify } from '@brz/shared'
import { push } from 'notivue';
import { useCategoriesByType } from '~/composables/back-office/useCategory';

const route = useRoute()
const { post, loading, updateSelf, updateStatus, updateCategories } = await usePost(route.params.id as unknown as number)
const { categories } = await useCategoriesByType('post')

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Actualité introuvable' })
}

const editingPost = ref<PostAttributesFrontend>(post.value)
const editingPostCategories = computed({
    get: () => {
        return editingPost.value.categories?.map(category => category.id) || [] as number[]
    },
    set: (newValue: number[]) => {
        editingPost.value.categories = categories.value.filter(category => newValue.includes(category.id))
    }
})

const { hasErrors, touch, touched, errors, submit } = useForm(
    ['title', 'slug', 'abstract', 'meta_title', 'meta_description', 'schedule_start', 'schedule_end', 'status', 'content'],
    {
        title: () => editingPost.value.title === '' ? 'Le titre est requis' : null,
        slug: () => editingPost.value.slug === '' ? 'Le slug est requis' : null,
        status: () => !editingPost.value.status ? 'Le status est requis' : null,
    }
)

const handleCategoryChange = async (silent: boolean = false) => {
    try {
        await updateCategories(editingPostCategories.value)
        if (!silent) push.success({ title: 'Catégories mises à jour !', message: 'Les catégories de l\'actualité ont été mises à jour avec succès.' })
    } catch (err: any) {
        const message = err?.data?.message ?? err?.message ?? 'Une erreur est survenue'
        push.error({ title: 'Erreur', message })
    }
}

const handlePublish = async (silent: boolean = false) => {
    try {
        editingPost.value.status = 'published'
        await updateStatus('published')
        if (!silent) push.success({ title: 'Publié !', message: 'L\'actualité a été publiée avec succès.' })
    } catch (err: any) {
        const message = err?.data?.message ?? err?.message ?? 'Une erreur est survenue'
        push.error({ title: 'Erreur', message })
    }
}

const handleSave = () => submit(async () => {
    await handleCategoryChange(true)
    try {
        await updateSelf(editingPost.value)
        navigateTo('/back-office/actualites')
        push.success({ title: 'Sauvegardé !', message: 'L\'actualité a été sauvegardée avec succès.' })
    } catch (err: any) {
        const message = err?.data?.message ?? err?.message ?? 'Une erreur est survenue'
        push.error({ title: 'Erreur', message })
    }
})

watch(() => editingPost.value?.title, (newTitle) => {
    editingPost.value.slug = slugify(newTitle)
})

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