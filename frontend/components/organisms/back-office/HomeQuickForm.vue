<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ editingHomeQuick.title || (mode === 'create' ? 'Nouvel accès rapide' : '') }}
            </h1>
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button label="Enregistrer" icon="ic:baseline-save" variant="primary" size="sm" :loading="loading"
                :disabled="couldHaveErrors" @click="handleSave" />
            <Button v-if="mode === 'edit'" label="Supprimer" icon="ic:baseline-delete" variant="warning" size="sm"
                :loading="loading" @click="handleDelete" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="flex flex-col gap-6 2xl:gap-10 xl:flex-row">
            <div class="w-full xl:w-9/12 space-y-12">
                <section>
                    <h4 class="title-submain mb-6">Informations générales</h4>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingHomeQuick.title" required label="Titre" hint="Titre principale"
                                roundness="md" :error="errors.title" @blur="touch('title')" />
                            <Field v-model="editingHomeQuick.url" required label="URL" type="url"
                                placeholder="https://www.exemple.com"
                                hint="examples:&nbsp;&nbsp;https://www.exemple.com,&nbsp;&nbsp;/actualites/mon-actu"
                                roundness="md" :error="errors.url" @blur="touch('url')" />
                        </div>
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingHomeQuick.description" type="textarea" label="Description courte"
                                hint="Description affichée sous le titre" roundness="md" :error="errors.description"
                                @blur="touch('description')" />
                            <IconPicker v-model="editingHomeQuick.icon" required label="Icon"
                                placeholder="https://www.exemple.com" hint="Icon affichée en accès rapide"
                                :error="errors.icon" />
                        </div>
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-6">Affichage</h4>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingHomeQuick.order" required type="number" label="Ordre"
                                hint="Ordre d'affichage" roundness="md" :error="errors.order" @blur="touch('order')" />
                            <Switch v-model="editingHomeQuick.is_visible" label="Visible"
                                hint="Afficher ou masquer sur la page d'accueil"
                                text="Afficher ou masquer cet accès rapide" />
                        </div>
                    </div>
                </section>
                <section v-if="mode === 'edit'">
                    <Timestamps :created-at="editingHomeQuick.created_at" :updated-at="editingHomeQuick.updated_at" />
                </section>
            </div>
            <div class="px-auto xl:w-3/12">
                <div class="w-full mt-6 xl:mt-0 xl:sticky xl:top-5">
                    <h4 class="title-submain mb-6">Prévisualisation</h4>
                    <HomeQuickCard v-if="!couldHaveErrors" :clickable="false" :homeQuick="editingHomeQuick"
                        class="max-w-96" />
                    <div v-else>
                        <span class="text-gray-400">Saisissez les informations manquantes pour prévisualiser:
                            {{ errorLabels ? errorLabels.join(', ') : '' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isURL, isURLRelative, type HomeQuickAttributes } from '@brz/shared'
import Field from '~/components/atoms/Field.vue'
import IconPicker from '~/components/atoms/IconPicker.vue'
import Switch from '~/components/atoms/Switch.vue'
import Button from '~/components/atoms/Button.vue'
import Loader from '~/components/molecules/Loader.vue'
import HomeQuickCard from '~/components/organisms/front-office/HomeQuickCard.vue'
import Timestamps from './Timestamps.vue'

const props = withDefaults(defineProps<{
    initialHomeQuick: HomeQuickAttributes
    loading?: boolean
    mode: 'create' | 'edit'
}>(), {
    loading: false,
})

const emit = defineEmits<{
    save: [homeQuick: HomeQuickAttributes]
    delete: []
}>()

const editingHomeQuick = ref<HomeQuickAttributes>({ ...props.initialHomeQuick })

const { errorLabels, couldHaveErrors, touch, errors, submit } = useForm([
    { name: 'title', label: 'Titre', validation: () => editingHomeQuick.value.title === '' ? 'Le titre est requis' : null },
    { name: 'url', label: 'URL', validation: () => editingHomeQuick.value.url === '' || (!isURL(editingHomeQuick.value.url) && !isURLRelative(editingHomeQuick.value.url)) ? 'L\'URL est requise et doit être valide' : null },
    { name: 'description', label: 'Description' },
    { name: 'icon', label: 'Icône', validation: () => editingHomeQuick.value.icon === '' ? 'L\'icône est requise' : null },
    { name: 'order', label: 'Ordre', validation: () => editingHomeQuick.value.order === null ? 'L\'ordre est requis' : null },
    { name: 'is_visible', label: 'Visibilité' },
])
const handleSave = () => submit(() => {
    emit('save', editingHomeQuick.value)
})

const handleDelete = () => {
    emit('delete')
}
</script>