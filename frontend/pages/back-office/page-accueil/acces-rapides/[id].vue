<template>
    <HomeQuickForm v-if="homeQuick" :initial-home-quick="homeQuick" :loading="loading" mode="edit" @save="handleSave"
        @delete="handleDelete" />
</template>

<script setup lang="ts">
import type { HomeQuickAttributes } from '@brz/shared'
import HomeQuickForm from '~/components/organisms/back-office/HomeQuickForm.vue'
import { push } from 'notivue'
import { useEditHomeQuick } from '~/composables/back-office/useHomeQuick'

const route = useRoute()
const { homeQuick, loading, deleteSelf, updateSelf } = await useEditHomeQuick(route.params.id as unknown as number)
const { confirm } = useConfirm()

if (!homeQuick.value) {
    throw createError({ statusCode: 404, statusMessage: 'Actualité introuvable' })
}

const handleSave = async (editedHomeQuick: HomeQuickAttributes) => {
    try {
        await updateSelf(editedHomeQuick)
        navigateTo('/back-office/page-accueil/acces-rapides')
        push.success({ title: 'Sauvegardé !', message: 'L\'accès rapide a été sauvegardé avec succès.' })
    } catch (err: any) {
        push.error({ title: 'Erreur', message: err?.data?.message ?? err?.message ?? 'Une erreur est survenue' })
    }
}

const handleDelete = async () => {
    const ok = await confirm({
        title: 'Supprimer l\'accès rapide ?',
        message: 'Cette action est irréversible. L\'accès rapide sera définitivement supprimé.',
        confirmLabel: 'Supprimer',
        variant: 'danger',
    })
    if (!ok) return

    try {
        await deleteSelf()
        navigateTo('/back-office/page-accueil/acces-rapides')
        push.success({ title: 'Supprimé !', message: 'L\'accès rapide a été supprimé avec succès.' })
    } catch (err: any) {
        push.error({ title: 'Erreur', message: err?.data?.message ?? err?.message ?? 'Une erreur est survenue' })
    }
}

useAppHead({ title: 'Modifier un accès rapide' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier un accès rapide',
    private: true,
})
</script>