<template>
    <UserForm v-if="user" :initial-user="user" :roles="roles" :loading="loading" mode="edit"
        @save="handleSave" @delete="handleDelete" />
</template>

<script setup lang="ts">
import { parseValidationErrors, type UserAttributesFrontend } from '@brz/shared'
import UserForm from '~/components/organisms/back-office/UserForm.vue'
import { push } from 'notivue'
import { useEditUser } from '~/composables/back-office/useUser'
import { useRolesAll } from '~/composables/back-office/useRole'

const route = useRoute()
const { user, loading, deleteSelf, updateSelf } = await useEditUser(route.params.id as unknown as number)
const { roles } = await useRolesAll()
const { confirm } = useConfirm()

if (!user.value) {
    throw createError({ statusCode: 404, statusMessage: 'Utilisateur introuvable' })
}

const handleSave = async (editedUser: UserAttributesFrontend) => {
    try {
        await updateSelf(editedUser)
        navigateTo('/back-office/utilisateurs')
        push.success({ title: 'Sauvegardé !', message: 'L\'utilisateur a été sauvegardé avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

const handleDelete = async () => {
    const ok = await confirm({
        title: 'Supprimer l\'utilisateur ?',
        message: 'Cette action est irréversible. L\'utilisateur sera définitivement supprimé.',
        confirmLabel: 'Supprimer',
        variant: 'danger',
    })
    if (!ok) return

    try {
        await deleteSelf()
        navigateTo('/back-office/utilisateurs')
        push.success({ title: 'Supprimé !', message: 'L\'utilisateur a été supprimé avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Modifier un utilisateur' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Modifier un utilisateur',
    private: true,
})
</script>