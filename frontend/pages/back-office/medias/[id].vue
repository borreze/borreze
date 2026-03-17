<template>
    <div>
        <MediaFormEdit v-if="media" :initial-media="media" :loading="loading" @save="handleSave"
            @delete="handleDelete" />
    </div>
</template>

<script setup lang="ts">
import type { MediaAttributes } from '@brz/shared'
import MediaFormEdit from '~/components/organisms/back-office/MediaFormEdit.vue'
import { push } from 'notivue'
import { useEditMedia } from '~/composables/back-office/useMedia'

const route = useRoute()
const id = Number(route.params.id)

const { media, loading, updateSelf, deleteSelf } = await useEditMedia(id)

const { confirm } = useConfirm()

const handleSave = async (payload: MediaAttributes) => {
    try {
        await updateSelf({ file_name: payload.file_name })
        push.success({ title: 'Modifié !', message: 'Le média a été mis à jour.' })
    } catch (err: any) {
        const message = err?.data?.message ?? err?.message ?? 'Une erreur est survenue'
        push.error({ title: 'Erreur', message })
    }
}

const handleDelete = async () => {
    const confirmed = await confirm({
        title: 'Supprimer ce média ?',
        message: 'Cette action est irréversible. Le fichier sera supprimé du serveur.',
    })
    if (!confirmed) return

    try {
        await deleteSelf()
        push.success({ title: 'Supprimé !', message: 'Le média a été supprimé.' })
        navigateTo('/back-office/medias')
    } catch (err: any) {
        const message = err?.data?.message ?? err?.message ?? 'Une erreur est survenue'
        push.error({ title: 'Erreur', message })
    }
}

useAppHead({ title: media.value?.file_name ?? 'Média' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier un média',
    private: true,
})
</script>