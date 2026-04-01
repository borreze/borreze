<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ editingPopup.title || (mode === 'create' ? 'Nouvelle popup d\'alerte' : '') }}
            </h1>
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button v-if="authStore.canIDo('popup', 'update')" label="Enregistrer" icon="ic:baseline-save"
                variant="primary" size="sm" :loading="loading" :disabled="couldHaveErrors" @click="handleSave" />
            <Button v-if="authStore.canIDo('popup', 'delete') && mode === 'edit'" label="Supprimer"
                icon="ic:baseline-delete" variant="warning" size="sm" :loading="loading" @click="handleDelete" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="flex flex-col gap-6 2xl:gap-10">
            <div class="w-full space-y-12">
                <section>
                    <h4 class="title-submain mb-6">Informations générales</h4>
                    <div class="flex flex-col gap-4">
                        <Field v-model="editingPopup.title" required label="Titre" hint="Titre principale"
                            roundness="md" :error="errors.title" @blur="touch('title')" />
                        <Field v-model="editingPopup.content" type="textarea" label="Contenu" hint="Contenu affiché"
                            roundness="md" :error="errors.content" @blur="touch('content')" />
                        <div>
                            <MediaPicker v-model="editingPopup.media" required label="Média"
                                hint="Sélectionnez une média à mettre en avant" :error="errors.media"
                                @update="touch('media')" />
                        </div>
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-4">Affichage</h4>
                    <p class="hint mb-2">
                        Ne saisissez pas de date de début et de fin si vous souhaitez que la popup soit active
                        immédiatement et indéfiniment.<br>
                        Si vous saisissez une date de début dans le futur, elle sera programmée pour être active
                        à cette date.<br>
                        Si vous saisissez une date de fin, elle sera retirée à cette date.<br>
                        Les dates de sont prioritaires sur l'activation : une popup activé mais une date de début dans
                        le futur sera automatiquement passé en non-visible jusqu'à la
                        date de début.
                    </p>
                    <div class="flex flex-row flex-wrap gap-4 mb-6">
                        <div class="max-w-xs">
                            <Datepicker v-model="editingPopup.date_from" :with-time="true" label="Date de début"
                                roundness="md" :error="errors.date_from" @blur="touch('date_from')" />
                        </div>
                        <div class="max-w-xs">
                            <Datepicker v-model="editingPopup.date_to" :with-time="true" label="Date de fin"
                                roundness="md" :error="errors.date_to" @blur="touch('date_to')" />
                        </div>
                    </div>
                    <div v-if="!datted" class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Switch v-model="editingPopup.is_active" label="Actif" required
                                hint="Une seule popup peut s'afficher à la fois sur le site publique, si plusieurs sont actives, elles s'afficheront une à la fois"
                                text="Afficher ou masquer cette popup sur tout le site" />
                        </div>
                    </div>
                </section>
                <section v-if="mode === 'edit'">
                    <Timestamps :created-at="editingPopup.created_at" :updated-at="editingPopup.updated_at" />
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type PopupAttributesFrontend } from '@brz/shared'
import Field from '~/components/atoms/Field.vue'
import Switch from '~/components/atoms/Switch.vue'
import Button from '~/components/atoms/Button.vue'
import Loader from '~/components/molecules/Loader.vue'
import Datepicker from '~/components/atoms/Datepicker.vue'
import { formatDateTime } from '~/utils/date'
import MediaPicker from './MediaPicker.vue'
import Timestamps from './Timestamps.vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const props = withDefaults(defineProps<{
    initialPopup: PopupAttributesFrontend
    loading?: boolean
    mode: 'create' | 'edit'
}>(), {
    loading: false,
})

const emit = defineEmits<{
    save: [popup: PopupAttributesFrontend]
    delete: []
}>()

const editingPopup = ref<PopupAttributesFrontend>({ ...props.initialPopup })

const { couldHaveErrors, touch, errors, submit } = useForm([
    { name: 'title', label: 'Titre', validation: () => editingPopup.value.title === '' ? 'Le titre est requis' : null },
    { name: 'content', label: 'Contenu' },
    { name: 'date_from', label: 'Date de début' },
    { name: 'date_to', label: 'Date de fin' },
    { name: 'is_active', label: 'Actif', validation: () => editingPopup.value.is_active === null ? 'Le statut actif est requis' : null },
    { name: 'media', label: 'Média' },
])

const handleSave = () => submit(() => {
    if (editingPopup.value.media) { // ensure media is set for backend, but remove media object to avoid creating a new media
        editingPopup.value.media_id = editingPopup.value.media?.id || null
        delete editingPopup.value.media
    }
    emit('save', editingPopup.value)
})

const handleDelete = () => {
    emit('delete')
}

const datted = computed(() => {
    if (!editingPopup.value.date_from) return false
    if (!editingPopup.value.date_to) return false

    const dateFrom = new Date(editingPopup.value.date_from)
    const dateTo = new Date(editingPopup.value.date_to)
    return dateFrom && dateTo && (dateFrom <= dateTo)
})

</script>