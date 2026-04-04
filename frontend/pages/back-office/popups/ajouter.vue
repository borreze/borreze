<template>
    <PopupForm :initial-popup="defaultPopup" mode="create" @save="handleSave" />
</template>

<script setup lang="ts">
import { parseValidationErrors, type PopupAttributesFrontend } from '@brz/shared'
import PopupForm from '~/components/organisms/back-office/PopupForm.vue'
import { push } from 'notivue'
import { useCreatePopup } from '~/composables/back-office/usePopup'

const { createSelf } = useCreatePopup()

const defaultPopup: PopupAttributesFrontend = {
    id: 0, // trick to satisfy types, will be ignored by backend
    title: '',
    content: '',
    date_from: null,
    date_to: null,
    is_active: true,
}

const handleSave = async (popup: PopupAttributesFrontend) => {
    try {
        await createSelf(popup)
        navigateTo('/back-office/popups')
        push.success({ title: 'Créée !', message: 'La popup a été créée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Nouvelle popup' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Nouvelle popup',
    private: true,
})
</script>