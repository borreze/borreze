<template>
    <PostForm v-if="post" :initial-post="post" :categories="categories" :loading="loading" mode="edit"
        @save="handleSave" @publish="handlePublish" @delete="handleDelete" />
</template>

<script setup lang="ts">
import type { PostAttributesFrontend } from '@brz/shared'
import PostForm from '~/components/organisms/back-office/PostForm.vue'
import { push } from 'notivue'
import { useEditPost } from '~/composables/back-office/usePost'
import { useCategoriesAll } from '~/composables/back-office/useCategory'

const route = useRoute()
const { post, loading, deleteSelf, updateSelf, updateStatus, updateCategories } = await useEditPost(route.params.id as unknown as number)
const { categories } = await useCategoriesAll()
const { confirm } = useConfirm()

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Actualité introuvable' })
}

const handleSave = async (editedPost: PostAttributesFrontend, categoryIds: number[]) => {
    try {
        await updateSelf(editedPost)
        await updateCategories(categoryIds)
        navigateTo('/back-office/actualites')
        push.success({ title: 'Sauvegardé !', message: 'L\'actualité a été sauvegardée avec succès.' })
    } catch (err: any) {
        push.error({ title: 'Erreur', message: err?.data?.message ?? err?.message ?? 'Une erreur est survenue' })
    }
}

const handlePublish = async () => {
    try {
        await updateStatus('published')
        navigateTo('/back-office/actualites')
        push.success({ title: 'Publié !', message: 'L\'actualité a été publiée avec succès.' })
    } catch (err: any) {
        push.error({ title: 'Erreur', message: err?.data?.message ?? err?.message ?? 'Une erreur est survenue' })
    }
}

const handleDelete = async () => {
    const ok = await confirm({
        title: 'Supprimer l\'actualité ?',
        message: 'Cette action est irréversible. L\'actualité sera définitivement supprimée.',
        confirmLabel: 'Supprimer',
        variant: 'danger',
    })
    if (!ok) return

    try {
        await deleteSelf()
        navigateTo('/back-office/actualites')
        push.success({ title: 'Supprimé !', message: 'L\'actualité a été supprimée avec succès.' })
    } catch (err: any) {
        push.error({ title: 'Erreur', message: err?.data?.message ?? err?.message ?? 'Une erreur est survenue' })
    }
}

useAppHead({ title: 'Modifier une actualité' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier une actualité',
    private: true,
})
</script>