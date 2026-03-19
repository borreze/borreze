<template>
    <HomeQuickForm :initial-home-quick="defaultHomeQuick" mode="create" @save="handleSave" />
</template>

<script setup lang="ts">
import type { HomeQuickAttributes } from '@brz/shared'
import HomeQuickForm from '~/components/organisms/back-office/HomeQuickForm.vue'
import { push } from 'notivue'
import { useCreateHomeQuick } from '~/composables/back-office/useHomeQuick'

const { createSelf } = useCreateHomeQuick()

const defaultHomeQuick: HomeQuickAttributes = {
    id: 0, // trick to satisfy types, will be ignored by backend
    title: '',
    icon: '',
    url: '',
    order: 0,
    is_visible: true,
}

const handleSave = async (homeQuick: HomeQuickAttributes) => {
    try {
        await createSelf(homeQuick)
        navigateTo('/back-office/page-accueil/acces-rapides')
        push.success({ title: 'Créé !', message: 'L\'accès rapide a été créé avec succès.' })
    } catch (err: any) {
        const message = err?.data?.message ?? err?.message ?? 'Une erreur est survenue'
        push.error({ title: 'Erreur', message })
    }
}

useAppHead({ title: 'Nouvel accès rapide' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Nouvel accès rapide',
    private: true,
})
</script>