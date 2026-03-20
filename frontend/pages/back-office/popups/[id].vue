<template>
    <PopupForm v-if="popup" :initial-popup="popup" :loading="loading" mode="edit" @save="handleSave"
        @delete="handleDelete" />
</template>

<script setup lang="ts">
import { parseValidationErrors, type PopupAttributes } from '@brz/shared'
import PopupForm from '~/components/organisms/back-office/PopupForm.vue'
import { push } from 'notivue'
import { useEditPopup } from '~/composables/back-office/usePopup'

const route = useRoute()
const { popup, loading, deleteSelf, updateSelf } = await useEditPopup(route.params.id as unknown as number)
const { confirm } = useConfirm()

if (!popup.value) {
    throw createError({ statusCode: 404, statusMessage: 'Popup introuvable' })
}

const handleSave = async (editedPopup: PopupAttributes) => {
    try {
        await updateSelf(editedPopup)
        navigateTo('/back-office/popups')
        push.success({ title: 'Sauvegardé !', message: 'La popup a été sauvegardé avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

const handleDelete = async () => {
    const ok = await confirm({
        title: 'Supprimer la popup ?',
        message: 'Cette action est irréversible. La popup sera définitivement supprimé.',
        confirmLabel: 'Supprimer',
        variant: 'danger',
    })
    if (!ok) return

    try {
        await deleteSelf()
        navigateTo('/back-office/popups')
        push.success({ title: 'Supprimé !', message: 'La popup a été supprimé avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Modifier une popup' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier une popup',
    private: true,
})
</script>