<template>
    <MediaFormEdit v-if="media" :initial-media="media" :loading="loading" @save="handleSave" @delete="handleDelete" />
</template>

<script setup lang="ts">
import type { MediaAttributes } from '@brz/shared'
import MediaFormEdit from '~/components/organisms/back-office/MediaFormEdit.vue'
import { push } from 'notivue'
import { useEditMedia } from '~/composables/back-office/useMedia'

const route = useRoute()
const { media, loading, updateSelf, deleteSelf } = await useEditMedia(route.params.id as unknown as number)
const { confirm } = useConfirm()

if (!media.value) {
    throw createError({ statusCode: 404, statusMessage: 'Média introuvable' })
}

const handleSave = async (editingMedia: MediaAttributes) => {
    try {
        await updateSelf(editingMedia)
        navigateTo('/back-office/medias')
        push.success({ title: 'Modifié !', message: 'Le média a été mis à jour.' })
    } catch (err: any) {
        push.error({ title: 'Erreur', message: err?.data?.message ?? err?.message ?? 'Une erreur est survenue' })
    }
}

const handleDelete = async () => {
    const ok = await confirm({
        title: 'Supprimer ce média ?',
        message: 'Cette action est irréversible. Le fichier sera supprimé du serveur.',
        confirmLabel: 'Supprimer',
        variant: 'danger',
    })
    if (!ok) return

    try {
        await deleteSelf()
        navigateTo('/back-office/medias')
        push.success({ title: 'Supprimé !', message: 'Le média a été supprimé.' })
    } catch (err: any) {
        const message = err?.data?.message ?? err?.message ?? 'Une erreur est survenue'
        push.error({ title: 'Erreur', message })
    }
}

useAppHead({ title: 'Modifier un média' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier un média',
    private: true,
})
</script>