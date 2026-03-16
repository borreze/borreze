<template>
    <PostForm :initial-post="defaultPost" :categories="categories" :loading="loading" mode="create"
        @save="handleSave" />
</template>

<script setup lang="ts">
import type { PostAttributesFrontend } from '@brz/shared'
import PostForm from '~/components/organisms/back-office/PostForm.vue'
import { push } from 'notivue'
import { useCreatePost } from '~/composables/back-office/usePost'
import { useCategoriesAll } from '~/composables/back-office/useCategory'

const { categories } = await useCategoriesAll()
const { createSelf, assignCategories } = useCreatePost()
const loading = ref(false)

const defaultPost: PostAttributesFrontend = {
    id: 0, // trick to satisfy types, will be ignored by backend
    title: '',
    slug: '',
    abstract: '',
    content: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    schedule_start: null,
    schedule_end: null,
    categories: [],
}

const handleSave = async (post: PostAttributesFrontend, categoryIds: number[]) => {
    loading.value = true
    try {
        const created = await createSelf(post)
        if (created && categoryIds.length) {
            await assignCategories(created.data.id, categoryIds)
        }
        navigateTo('/back-office/actualites')
        push.success({ title: 'Créé !', message: 'L\'actualité a été créée avec succès.' })
    } catch (err: any) {
        const message = err?.data?.message ?? err?.message ?? 'Une erreur est survenue'
        push.error({ title: 'Erreur', message })
    } finally {
        loading.value = false
    }
}

useAppHead({ title: 'Nouvelle actualité' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Nouvelle actualité',
    private: true,
})
</script>