<template>
    <PostForm :initial-post="defaultPost" :categories="categories" mode="create" @save="handleSave" />
</template>

<script setup lang="ts">
import { parseValidationErrors, type PostAttributesFrontend } from '@brz/shared'
import PostForm from '~/components/organisms/back-office/PostForm.vue'
import { push } from 'notivue'
import { useCreatePost } from '~/composables/back-office/usePost'
import { useCategoriesAll } from '~/composables/back-office/useCategory'

const { categories } = await useCategoriesAll()
const { createSelf, assignCategories } = useCreatePost('event')

const defaultPost: PostAttributesFrontend = {
    id: 0, // trick to satisfy types, will be ignored by backend
    title: '',
    slug: '',
    abstract: '',
    content: '',
    status: 'draft',
    type: 'event',
    meta_title: '',
    meta_description: '',
    schedule_start: null,
    schedule_end: null,
    categories: [],
}

const handleSave = async (post: PostAttributesFrontend, categoryIds: number[]) => {
    try {
        const created = await createSelf(post)
        if (created && categoryIds.length) {
            await assignCategories(created.data.id, categoryIds)
        }
        navigateTo('/back-office/evenements')
        push.success({ title: 'Créé !', message: 'L\'événement a été créée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Nouvel événement' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Nouvel événement',
    private: true,
})
</script>