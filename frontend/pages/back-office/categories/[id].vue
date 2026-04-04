<template>
    <CategoryForm v-if="category" :initial-category="category" :loading="loading" mode="edit" @save="handleSave"
        @delete="handleDelete" />
</template>

<script setup lang="ts">
import { parseValidationErrors, type CategoryAttributes } from '@brz/shared'
import CategoryForm from '~/components/organisms/back-office/CategoryForm.vue'
import { push } from 'notivue'
import { useEditCategory } from '~/composables/back-office/useCategory'

const route = useRoute()
const { category, loading, deleteSelf, updateSelf } = await useEditCategory(route.params.id as unknown as number)
const { confirm } = useConfirm()

if (!category.value) {
    throw createError({ statusCode: 404, statusMessage: 'Catégorie introuvable' })
}

const handleSave = async (editedCategory: CategoryAttributes) => {
    try {
        await updateSelf(editedCategory)
        navigateTo('/back-office/categories')
        push.success({ title: 'Sauvegardé !', message: 'La catégorie a été sauvegardée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

const handleDelete = async () => {
    const ok = await confirm({
        title: 'Supprimer la catégorie ?',
        message: 'Cette action est irréversible. La catégorie sera définitivement supprimée.',
        confirmLabel: 'Supprimer',
        variant: 'danger',
    })
    if (!ok) return

    try {
        await deleteSelf()
        navigateTo('/back-office/page-accueil/categories')
        push.success({ title: 'Supprimé !', message: 'La catégorie a été supprimée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Modifier une catégorie' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier une catégorie',
    private: true,
})
</script>