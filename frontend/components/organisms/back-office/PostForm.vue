<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ editingPost.title || (mode === 'create' ? 'Nouveau' : '') }}
            </h1>
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button v-if="authStore.canIDo('post', 'update')" label="Enregistrer" icon="ic:baseline-save"
                variant="primary" size="sm" :loading="loading" :disabled="couldHaveErrors" @click="handleSave" />
            <Button v-if="authStore.canIDo('post', 'update') && mode === 'edit'"
                :label="editingPost.status === 'published' ? 'Déjà publié' : 'Publier'" icon="ic:baseline-publish"
                variant="outline" size="sm" :loading="loading"
                :disabled="couldHaveErrors || editingPost.status === 'published' || !scheduled"
                :title="editingPost.status === 'published' ? 'Le contenu est déjà publié' : 'Publier le contenu'"
                @click="handlePublish" />
            <Button v-if="authStore.canIDo('post', 'delete') && mode === 'edit' && editingPost?.deletable"
                label="Supprimer" icon="ic:baseline-delete" variant="warning" size="sm" :loading="loading"
                @click="handleDelete" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="flex flex-col gap-6 2xl:gap-10 xl:flex-row">
            <div class="w-full xl:w-9/12 space-y-12">
                <section>
                    <h4 class="title-submain mb-6">Informations générales</h4>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingPost.title" required label="Titre" hint="Titre principale"
                                roundness="md" :error="errors.title" @blur="touch('title')" />
                            <Field v-model="editingPost.slug" required label="Slug"
                                hint="Identifiant unique, utilisé pour les URL" roundness="md" :error="errors.slug"
                                @blur="touch('slug')" />
                        </div>
                        <Field v-model="editingPost.abstract" type="textarea" label="Résumé"
                            hint="Résumé, utilisé lors de l'affichage en liste" roundness="md" :error="errors.abstract"
                            @blur="touch('abstract')" />
                        <div v-if="editingPost.type === 'event'" class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingPost.address" label="Adresse de l'événement" roundness="md"
                                :error="errors.address" @blur="touch('address')" />
                            <Datepicker v-model="editingPost.date_time" required :with-time="true"
                                label="Date et heure de l'événement" roundness="md" :error="errors.date_time"
                                @blur="touch('date_time')" />
                        </div>
                        <div>
                            <MediaPicker v-model="editingPost.cover" media-type="image" required label="Couverture"
                                hint="Sélectionnez une image de couverture" :error="errors.cover"
                                @update="touch('cover')" />
                        </div>
                        <div class="max-w-xs">
                            <Dropdown v-model="editingPostCategories" variant="light" size="md" label="Catégories"
                                placeholder="Aucune" label-key="name" value-key="id" multiple :items="categories" />
                        </div>
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-4">Contact</h4>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingPost.contact_name" label="Nom et prénom"
                                hint="Nom et prénom de la personne à contacter pour cet événement" roundness="md"
                                :error="errors.contact_name" @blur="touch('contact_name')" />
                            <Field v-model="editingPost.contact_email" label="Email"
                                hint="Email de la personne à contacter pour cet événement" roundness="md"
                                :error="errors.contact_email" @blur="touch('contact_email')" />
                            <Field v-model="editingPost.contact_phone" label="Téléphone"
                                hint="Téléphone de la personne à contacter pour cet événement" roundness="md"
                                :error="errors.contact_phone" @blur="touch('contact_phone')" />
                        </div>
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-4">Publication</h4>
                    <p class="hint mb-2">
                        Ne saisissez pas de date de début et de fin si vous souhaitez que le contenu soit publiée
                        immédiatement et indéfiniment.<br>
                        Si vous saisissez une date de début dans le futur, le contenu sera programmée pour être publiée
                        à cette date.<br>
                        Si vous saisissez une date de fin, le contenu sera retirée de la publication à cette date.<br>
                        Les dates de publications sont prioritaires sur le status : un contenu avec un status
                        "Publié" mais une date de début dans le futur sera automatiquement passé en "archivé" jusqu'à la
                        date de début.
                    </p>
                    <div class="flex flex-row flex-wrap gap-4">
                        <div class="max-w-xs">
                            <Datepicker v-model="editingPost.schedule_start" :with-time="true"
                                label="Date de début de publication" roundness="md" :error="errors.schedule_start"
                                @blur="touch('schedule_start')" />
                        </div>
                        <div class="max-w-xs">
                            <Datepicker v-model="editingPost.schedule_end" :with-time="true"
                                label="Date de fin de publication" roundness="md" :error="errors.schedule_end"
                                @blur="touch('schedule_end')" />
                        </div>
                        <div v-if="!scheduled" class="max-w-xs">
                            <Dropdown v-model="editingPost.status" variant="light" size="md"
                                label="Status de publication" placeholder="Status de publication"
                                :items="POST_STATUSES_OBJECTS" @close="touch('status')" />
                        </div>
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-6">SEO</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <Field v-model="editingPost.meta_title" label="Meta titre"
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
                <section v-if="mode === 'edit'">
                    <Timestamps :created-at="editingPost.created_at" :updated-at="editingPost.updated_at" />
                </section>
            </div>
            <div class="px-auto xl:w-3/12">
                <div class="w-full mt-6 xl:mt-0 xl:sticky xl:top-5">
                    <h4 class="title-submain mb-6">Prévisualisation</h4>
                    <div v-if="!couldHaveErrors" class="max-w-96">
                        <div v-if="!editingPost.type" class="text-gray-400">Prévisualisation non disponible pour ce type
                            de contenu</div>
                        <EventCard v-else-if="editingPost.type === 'event'" :clickable="false" :post="editingPost" />
                        <ProjectCard v-else-if="editingPost.type === 'project'" :clickable="false"
                            :post="editingPost" />
                        <NewCard v-else-if="editingPost.type === 'new'" :clickable="false" :post="editingPost" />
                        <div v-else class="text-gray-400">Prévisualisation non disponible pour ce type de contenu</div>
                    </div>
                    <div v-else>
                        <span class="text-gray-400">Saisissez les informations manquantes pour prévisualiser
                            {{ errorLabels && errorLabels.length ? `: ${errorLabels.join(', ')}` : '' }}</span>
                    </div>
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
import Timestamps from './Timestamps.vue'
import MediaPicker from './MediaPicker.vue'
import NewCard from '~/components/organisms/front-office/NewCard.vue'
import ProjectCard from '~/components/organisms/front-office/ProjectCard.vue'
import EventCard from '~/components/organisms/front-office/EventCard.vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const props = withDefaults(defineProps<{
    initialPost: PostAttributesFrontend
    categories: CategoryAttributes[]
    loading?: boolean
    mode: 'create' | 'edit'
}>(), {
    loading: false,
})

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

const { errorLabels, hasErrors, couldHaveErrors, touch, errors, submit } = useForm([
    // Common
    { name: 'title', label: 'Titre', validation: () => editingPost.value.title === '' ? 'Le titre est requis' : null },
    { name: 'slug', label: 'Slug', validation: () => editingPost.value.slug === '' ? 'Le slug est requis' : null },
    { name: 'abstract', label: 'Résumé' },
    { name: 'meta_title', label: 'Meta titre' },
    { name: 'meta_description', label: 'Meta description' },
    { name: 'schedule_start', label: 'Début de publication' },
    { name: 'schedule_end', label: 'Fin de publication' },
    { name: 'status', label: 'Status', validation: () => !editingPost.value.status ? 'Le status est requis' : null },
    { name: 'content', label: 'Contenu' },
    { name: 'cover', label: 'Couverture', validation: () => !editingPost.value.cover ? 'La couverture est requise' : null },
    // Event
    { name: 'date_time', label: 'Date et heure', validation: () => (editingPost.value.type === 'event' && !editingPost.value.date_time) ? 'La date et heure sont requises' : null },
    { name: 'address', label: 'Adresse de l\'événement' },
    { name: 'contact_name', label: 'Nom et prénom du contact' },
    { name: 'contact_email', label: 'Email du contact' },
    { name: 'contact_phone', label: 'Téléphone du contact' },
])

const handleSave = () => submit(() => {
    const categoryIds = [...editingPostCategories.value]

    if (editingPost.value.cover) { // ensure cover_id is set for backend, but remove cover object to avoid creating a new media
        editingPost.value.cover_id = editingPost.value.cover?.id || null
        delete editingPost.value.cover
    }
    if (editingPost.value.categories) { // remove categories array to avoid creating new categories
        delete editingPost.value.categories
    }
    emit('save', editingPost.value, categoryIds)
})

const handlePublish = () => {
    editingPost.value.status = 'published' // set status to published locally to update preview
    editingPost.value.published_at = new Date() // set published_at to now locally to update preview
    emit('publish')
}

const handleDelete = () => {
    emit('delete')
}

const scheduled = computed(() => {
    if (!editingPost.value.schedule_start) return false
    if (!editingPost.value.schedule_end) return false

    const scheduleStart = new Date(editingPost.value.schedule_start)
    const scheduleEnd = new Date(editingPost.value.schedule_end)
    return scheduleStart && scheduleEnd && (scheduleStart <= scheduleEnd)
})

watch(() => editingPost.value.title, (newTitle) => {
    if (props.mode === 'edit') return // prevent slug from changing in edit so URL doesnt change
    editingPost.value.slug = slugify(newTitle)
})
</script>