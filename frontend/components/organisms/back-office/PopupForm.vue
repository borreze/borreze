<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ mode === 'edit' ? `#${editingPopup.id}&nbsp;` : '' }}
                {{ editingPopup.title || (mode === 'create' ? 'Nouvel popup d\'alerte' : '') }}
            </h1>
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button label="Enregistrer" icon="ic:baseline-save" variant="primary" size="sm" :loading="loading"
                :disabled="couldHaveErrors" @click="handleSave" />
            <Button v-if="mode === 'edit'" label="Supprimer" icon="ic:baseline-delete" variant="warning" size="sm"
                :loading="loading" @click="handleDelete" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="flex flex-col gap-6 2xl:gap-10">
            <div class="w-full">
                <section>
                    <h4 class="title-submain mb-6">Informations générales</h4>
                    <div class="flex flex-col gap-4">
                        <Field v-model="editingPopup.title" required label="Titre" hint="Titre principale"
                            roundness="md" :error="errors.title" @blur="touch('title')" />
                        <Field v-model="editingPopup.content" type="textarea" label="content courte"
                            hint="content affichée sous le titre" roundness="md" :error="errors.content"
                            @blur="touch('content')" />
                    </div>
                </section>
                <section>
                    <h4 class="title-submain mb-4">Affichage</h4>
                    <p class="hint mb-2">
                        Ne saisissez pas de date de début et de fin si vous souhaitez que la popup soit active
                        immédiatement et indéfiniment.<br>
                        Si vous saisissez une date de début dans le futur, elle sera programmée pour être active
                        à cette date.<br>
                        Si vous saisissez une date de fin, elle sera retirée à cette date.
                    </p>
                    <div class="flex flex-row flex-wrap gap-4">
                        <div class="max-w-xs">
                            <Datepicker v-model="editingPopup.date_from" :with-time="true" label="Date de début"
                                type="date" roundness="md" :error="errors.date_from" @blur="touch('date_from')" />
                        </div>
                        <div class="max-w-xs">
                            <Datepicker v-model="editingPopup.date_to" :with-time="true" label="Date de fin" type="date"
                                roundness="md" :error="errors.date_to" @blur="touch('date_to')" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Switch v-model="editingPopup.is_active" label="Actif"
                                hint="Activer ou masquer sur tout le site" text="Afficher ou masquer cette popup" />
                        </div>
                    </div>
                </section>
                <section v-if="mode === 'edit'">
                    <span class="text-sm text-gray-600"><strong>Date de dernière modification:</strong> {{
                        formatDateTime(editingPopup.updated_at) }}</span>
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
import { formatDateTime } from '~/utils/date'

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

const { couldHaveErrors, hasErrors, touch, errors, submit } = useForm(
    ['date_from', 'date_to', 'title', 'content', 'is_active'],
    {
        title: () => editingPopup.value.title === '' ? 'Le titre est requis' : null,
        is_active: () => editingPopup.value.is_active === null ? 'L\'icône est requise' : null,
    }
)

const handleSave = () => submit(() => {
    emit('save', editingPopup.value)
})

const handleDelete = () => {
    emit('delete')
}
</script>