<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ editingCategory.name || (mode === 'create' ? 'Nouvelle catégorie' : '') }}
            </h1>
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button v-if="authStore.canIDo('category', 'update')" label="Enregistrer" icon="ic:baseline-save"
                variant="primary" size="sm" :loading="loading" :disabled="couldHaveErrors" @click="handleSave" />
            <Button v-if="authStore.canIDo('category', 'delete') && mode === 'edit'" label="Supprimer"
                icon="ic:baseline-delete" variant="warning" size="sm" :loading="loading" @click="handleDelete" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="flex flex-col gap-6 2xl:gap-10">
            <div class="w-full space-y-12">
                <section>
                    <h4 class="name-submain mb-6">Informations générales</h4>
                    <div class="flex flex-col gap-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <Field v-model="editingCategory.name" required label="Nom" roundness="md"
                                :error="errors.name" @blur="touch('name')" />
                            <Field v-model="editingCategory.slug" required label="Slug" hint="Identifiant unique"
                                roundness="md" :error="errors.slug" @blur="touch('slug')" />
                        </div>
                    </div>
                </section>
                <section v-if="mode === 'edit'">
                    <Timestamps :created-at="editingCategory.created_at" :updated-at="editingCategory.updated_at" />
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isSlugified, slugify, type CategoryAttributes } from '@brz/shared'
import Field from '~/components/atoms/Field.vue'
import Button from '~/components/atoms/Button.vue'
import Loader from '~/components/molecules/Loader.vue'
import Timestamps from './Timestamps.vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const props = withDefaults(defineProps<{
    initialCategory: CategoryAttributes
    loading?: boolean
    mode: 'create' | 'edit'
}>(), {
    loading: false,
})

const emit = defineEmits<{
    save: [category: CategoryAttributes]
    delete: []
}>()

const editingCategory = ref<CategoryAttributes>({ ...props.initialCategory })

const { errorLabels, couldHaveErrors, touch, errors, submit } = useForm([
    { name: 'name', label: 'Nom', validation: () => editingCategory.value.name === '' ? 'Le nom est requis' : null },
    { name: 'slug', label: 'Slug', validation: () => editingCategory.value.slug === '' || !isSlugified(editingCategory.value.slug) ? 'Le slug est requis et doit être composé de lettres, chiffres, tirets ou underscores' : null },
])
const handleSave = () => submit(() => {
    emit('save', editingCategory.value)
})

const handleDelete = () => {
    emit('delete')
}

watch(() => editingCategory.value.name, (newName) => {
    if (props.mode === 'edit') return // prevent slug from changing in edit so URL doesnt change
    editingCategory.value.slug = slugify(newName)
})
</script>