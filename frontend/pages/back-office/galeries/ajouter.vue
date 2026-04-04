<template>
    <GalleryForm :initial-gallery="defaultGallery" mode="create" @save="handleSave" />
</template>

<script setup lang="ts">
import { parseValidationErrors, type GalleryAttributesFrontend } from '@brz/shared'
import GalleryForm from '~/components/organisms/back-office/GalleryForm.vue'
import { push } from 'notivue'
import { useCreateGallery } from '~/composables/back-office/useGallery'

const { createSelf, assignPhotos } = useCreateGallery()

const defaultGallery: GalleryAttributesFrontend = {
    id: 0, // trick to satisfy types, will be ignored by backend
    name: '',
}

const handleSave = async (gallery: GalleryAttributesFrontend, photoIds: number[]) => {
    try {
        const created = await createSelf(gallery)
        if (created && photoIds.length) {
            await assignPhotos(created.data.id, photoIds)
        }
        navigateTo('/back-office/galeries')
        push.success({ title: 'Créée !', message: 'La galerie a été créée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Nouvelle galerie' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Nouvelle galerie',
    private: true,
})
</script>