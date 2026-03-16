<template>
    <div>
        <Teleport to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ editingPost.title || (mode === 'create' ? 'Nouvelle actualité' : '') }}
            </h1>
        </Teleport>
        <Teleport to="#page-actions">
            <Button label="Enregistrer" icon="ic:baseline-save" variant="primary" size="sm" :loading="loading"
                :disabled="hasErrors" @click="handleSave" />
            <Button v-if="mode === 'edit'" :label="editingPost.status === 'published' ? 'Déjà publié' : 'Publier'"
                icon="ic:baseline-publish" variant="outline" size="sm" :loading="loading"
                :disabled="editingPost.status === 'published'"
                :title="editingPost.status === 'published' ? 'L\'actualité est déjà publiée' : 'Publier l\'actualité'"
                @click="emit('publish')" />
            <Button v-if="mode === 'edit'" label="Supprimer" icon="ic:baseline-delete" variant="warning" size="sm"
                :loading="loading" @click="emit('delete')" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="flex flex-col gap-6 2xl:gap-10 xl:flex-row">
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
                        Si vous saisissez une date de fin, l'actualité sera retirée de la publication à cette date.<br>
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
                    <WysiwygEditor v-model="editingPost.content" :error="errors.content" @blur="touch('content')" />
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
import type { PostAttributesFrontend, CategoryAttributes } from '@brz/shared'
import { POST_STATUSES_OBJECTS, slugify } from '@brz/shared'
import Field from '~/components/atoms/Field.vue'
import Button from '~/components/atoms/Button.vue'
import Loader from '~/components/molecules/Loader.vue'
import Dropdown from '~/components/molecules/Dropdown.vue'
import Datepicker from '~/components/atoms/Datepicker.vue'
import WysiwygEditor from '~/components/organisms/back-office/WysiwygEditor.vue'
import PostCard from '~/components/organisms/front-office/PostCard.vue'

const props = defineProps<{
    initialPost: PostAttributesFrontend
    categories: CategoryAttributes[]
    loading: boolean
    mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
    save: [post: PostAttributesFrontend, categoryIds: number[]]
    publish: []
    delete: []
}>()

const editingPost = ref<PostAttributesFrontend>({ ...props.initialPost })

const editingPostCategories = computed({
    get: () => editingPost.value.categories?.map(c => c.id) ?? [],
    set: (newValue: number[]) => {
        editingPost.value.categories = props.categories.filter(c => newValue.includes(c.id))
    },
})

const { hasErrors, touch, errors, submit } = useForm(
    ['title', 'slug', 'abstract', 'meta_title', 'meta_description', 'schedule_start', 'schedule_end', 'status', 'content'],
    {
        title: () => editingPost.value.title === '' ? 'Le titre est requis' : null,
        slug: () => editingPost.value.slug === '' ? 'Le slug est requis' : null,
        status: () => !editingPost.value.status ? 'Le status est requis' : null,
    }
)

const handleSave = () => submit(() => {
    emit('save', editingPost.value, editingPostCategories.value)
})

watch(() => editingPost.value.title, (newTitle) => {
    editingPost.value.slug = slugify(newTitle)
})
</script>