<template>
    <CategoryForm :initial-category="defaultCategory" mode="create" @save="handleSave" />
</template>

<script setup lang="ts">
import { parseValidationErrors, type CategoryAttributes } from '@brz/shared'
import CategoryForm from '~/components/organisms/back-office/CategoryForm.vue'
import { push } from 'notivue'
import { useCreateCategory } from '~/composables/back-office/useCategory'

const { createSelf } = useCreateCategory()

const defaultCategory: CategoryAttributes = {
    id: 0, // trick to satisfy types, will be ignored by backend
    name: '',
    slug: '',
}

const handleSave = async (category: CategoryAttributes) => {
    try {
        await createSelf(category)
        navigateTo('/back-office/categories')
        push.success({ title: 'Créée !', message: 'La catégorie a été créée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Nouvelle catégorie' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Nouvelle catégorie',
    private: true,
})
</script>