<template>
    <GalleryForm v-if="gallery" :initial-gallery="gallery" :loading="loading" mode="edit"
        @save="handleSave"  @delete="handleDelete" />
</template>

<script setup lang="ts">
import { parseValidationErrors, type GalleryAttributesFrontend } from '@brz/shared'
import GalleryForm from '~/components/organisms/back-office/GalleryForm.vue'
import { push } from 'notivue'
import { useEditGallery } from '~/composables/back-office/useGallery'

const route = useRoute()
const { gallery, loading, deleteSelf, updateSelf, updatePhotos } = await useEditGallery(route.params.id as unknown as number)
const { confirm } = useConfirm()

if (!gallery.value) {
    throw createError({ statusCode: 404, statusMessage: 'Galerie introuvable' })
}

const handleSave = async (editedGallery: GalleryAttributesFrontend, photoIds: number[]) => {
    try {
        await updateSelf(editedGallery)
        await updatePhotos(photoIds)
        navigateTo('/back-office/galeries')
        push.success({ title: 'Sauvegardé !', message: 'La galerie a été sauvegardée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

const handleDelete = async () => {
    const ok = await confirm({
        title: 'Supprimer la galerie ?',
        message: 'Cette action est irréversible. La galerie sera définitivement supprimée.',
        confirmLabel: 'Supprimer',
        variant: 'danger',
    })
    if (!ok) return

    try {
        await deleteSelf()
        navigateTo('/back-office/galeries')
        push.success({ title: 'Supprimé !', message: 'La galerie a été supprimée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Modifier une galerie' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier une galerie',
    private: true,
})
</script>