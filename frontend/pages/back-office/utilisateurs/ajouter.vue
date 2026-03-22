<template>
    <UserForm :initial-user="defaultUser" :roles="roles" mode="create" @save="handleSave" />
</template>

<script setup lang="ts">
import { parseValidationErrors, USER_ROLE_ID_DEFAULT, type UserAttributesFrontendPassword } from '@brz/shared'
import UserForm from '~/components/organisms/back-office/UserForm.vue'
import { push } from 'notivue'
import { useCreateUser } from '~/composables/back-office/useUser'
import { useRolesAll } from '~/composables/back-office/useRole'

const { roles } = await useRolesAll()
const { createSelf } = useCreateUser()

const defaultUser: UserAttributesFrontendPassword = {
    id: 0, // trick to satisfy types, will be ignored by backend
    email: '',
    username: '',
    first_name: null,
    last_name: null,
    role_id: USER_ROLE_ID_DEFAULT,
    password: '',
    status: 'active',
}

const handleSave = async (user: UserAttributesFrontendPassword) => {
    try {
        await createSelf(user)
        navigateTo('/back-office/utilisateurs')
        push.success({ title: 'Créé !', message: 'L\'utilisateur a été créé avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
}

useAppHead({ title: 'Nouvel utilisateur' })

definePageMeta({
    layout: 'back-office',
    middleware: ['auth'],
    requiresAuth: false,
    title: 'Nouvel utilisateur',
    private: true,
})
</script>