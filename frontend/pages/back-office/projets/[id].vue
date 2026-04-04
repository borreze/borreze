<template>
    <PostForm v-if="post" :initial-post="post" :categories="categories" :loading="loading" mode="edit"
        @save="handleSave" @publish="handlePublish" @delete="handleDelete" />
</template>

<script setup lang="ts">
import { parseValidationErrors, type PostAttributesFrontend } from '@brz/shared'
import PostForm from '~/components/organisms/back-office/PostForm.vue'
import { push } from 'notivue'
import { useEditPost } from '~/composables/back-office/usePost'
import { useCategoriesAll } from '~/composables/back-office/useCategory'

const route = useRoute()
const { post, loading, deleteSelf, updateSelf, updateStatus, updateCategories, updateMedias } = await useEditPost('project', route.params.id as unknown as number)
const { categories } = await useCategoriesAll()
const { confirm } = useConfirm()

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Projet introuvable' })
}

const handleSave = async (editedPost: PostAttributesFrontend, categoryIds: number[], mediaIds: number[]) => {
    try {
        await updateSelf(editedPost)
        await updateCategories(categoryIds)
        await updateMedias(mediaIds)
        navigateTo('/back-office/projets')
        push.success({ title: 'Sauvegardé !', message: 'Le projet a été sauvegardé avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

const handlePublish = async () => {
    try {
        await updateStatus('published')
        navigateTo('/back-office/projets')
        push.success({ title: 'Publié !', message: 'Le projet a été publié avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

const handleDelete = async () => {
    const ok = await confirm({
        title: 'Supprimer le projet ?',
        message: 'Cette action est irréversible. Le projet sera définitivement supprimé.',
        confirmLabel: 'Supprimer',
        variant: 'danger',
    })
    if (!ok) return

    try {
        await deleteSelf()
        navigateTo('/back-office/projets')
        push.success({ title: 'Supprimé !', message: 'Le projet a été supprimé avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Modifier un projet' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier un projet',
    private: true,
})
</script>