<template>
    <div>
        <Teleport to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ mode === 'edit' ? `#${editingHomeQuick.id}&nbsp;` : '' }}
                {{ editingHomeQuick.title || (mode === 'create' ? 'Nouvel accès rapide' : '') }}
            </h1>
        </Teleport>
        <Teleport to="#page-actions">
            <Button label="Enregistrer" icon="ic:baseline-save" variant="primary" size="sm" :loading="loading"
                :disabled="hasErrors" @click="handleSave" />
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
                            <Field v-model="editingHomeQuick.title" required label="Titre"
                                hint="Titre principale de l'actualité" roundness="md" :error="errors.title"
                                @blur="touch('title')" />
                        </div>
                    </div>
                </section>
            </div>
            <div class="px-auto xl:w-3/12">
                <div class="w-full mt-6 xl:mt-0 xl:sticky xl:top-5">
                    <h4 class="title-submain mb-6">Prévisualisation</h4>
                    <HomeQuickCard :clickable="false" :homeQuick="editingHomeQuick" class="max-w-96" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type HomeQuickAttributes } from '@brz/shared'
import Field from '~/components/atoms/Field.vue'
import Button from '~/components/atoms/Button.vue'
import Loader from '~/components/molecules/Loader.vue'
import HomeQuickCard from '~/components/organisms/front-office/HomeQuickCard.vue'

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

const { hasErrors, touch, errors, submit } = useForm(
    ['title', 'slug', 'abstract', 'meta_title', 'meta_description', 'schedule_start', 'schedule_end', 'status', 'content'],
    {
        title: () => editingHomeQuick.value.title === '' ? 'Le titre est requis' : null,
    }
)

const handleSave = () => submit(() => {
    emit('save', editingHomeQuick.value)
})

const handleDelete = () => {
    emit('delete')
}
</script>