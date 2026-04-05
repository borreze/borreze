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
const { post, loading, deleteSelf, updateSelf, updateStatus, updateCategories, updateMedias } = await useEditPost('commerce', route.params.id as unknown as number)
const { categories } = await useCategoriesAll()
const { confirm } = useConfirm()

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Commerce introuvable' })
}

const handleSave = async (editedPost: PostAttributesFrontend, categoryIds: number[], mediaIds: number[]) => {
    try {
        await updateSelf(editedPost)
        await updateCategories(categoryIds)
        await updateMedias(mediaIds)
        navigateTo('/back-office/commerces')
        push.success({ title: 'Sauvegardé !', message: 'Le commerce a été sauvegardée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

const handlePublish = async () => {
    try {
        await updateStatus('published')
        navigateTo('/back-office/commerces')
        push.success({ title: 'Publié !', message: 'Le commerce a été publiée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

const handleDelete = async () => {
    const ok = await confirm({
        title: 'Supprimer le commerce ?',
        message: 'Cette action est irréversible. Le commerce sera définitivement supprimée.',
        confirmLabel: 'Supprimer',
        variant: 'danger',
    })
    if (!ok) return

    try {
        await deleteSelf()
        navigateTo('/back-office/commerces')
        push.success({ title: 'Supprimé !', message: 'Le commerce a été supprimée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Modifier un commerce' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier un commerce',
    private: true,
})
</script>