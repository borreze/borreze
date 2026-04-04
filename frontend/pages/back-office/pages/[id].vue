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
const { post, loading, deleteSelf, updateSelf, updateStatus, updateCategories } = await useEditPost('page', route.params.id as unknown as number)
const { categories } = await useCategoriesAll()
const { confirm } = useConfirm()

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page introuvable' })
}

const handleSave = async (editedPost: PostAttributesFrontend, categoryIds: number[]) => {
    try {
        await updateSelf(editedPost)
        await updateCategories(categoryIds)
        navigateTo('/back-office/pages')
        push.success({ title: 'Sauvegardé !', message: 'La page a été sauvegardée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

const handlePublish = async () => {
    try {
        await updateStatus('published')
        navigateTo('/back-office/pages')
        push.success({ title: 'Publié !', message: 'La page a été publiée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

const handleDelete = async () => {
    const ok = await confirm({
        title: 'Supprimer La page ?',
        message: 'Cette action est irréversible. La page sera définitivement supprimée.',
        confirmLabel: 'Supprimer',
        variant: 'danger',
    })
    if (!ok) return

    try {
        await deleteSelf()
        navigateTo('/back-office/pages')
        push.success({ title: 'Supprimé !', message: 'La page a été supprimée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Modifier une page' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier une page',
    private: true,
})
</script>