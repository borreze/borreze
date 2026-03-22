<template>
    <div>
        <Teleport defer to="#page-heading">
            <h1 class="title-main line-clamp-1">
                {{ mode === 'edit' ? `#${editingUser.id}&nbsp;` : '' }}
                {{ editingUser.username || (mode === 'create' ? 'Nouvel utilisateur' : '') }}
            </h1>
        </Teleport>
        <Teleport defer to="#page-actions">
            <Button label="Enregistrer" icon="ic:baseline-save" variant="primary" size="sm" :loading="loading"
                :disabled="couldHaveErrors" @click="handleSave" />
            <Button v-if="mode === 'edit'" label="Supprimer" icon="ic:baseline-delete" variant="warning" size="sm"
                :loading="loading" @click="handleDelete" />
        </Teleport>

        <Loader v-if="loading" />
        <div v-else class="w-full space-y-12">
            <section>
                <h4 class="title-submain mb-6">Informations générales</h4>
                <div class="flex flex-col gap-4 mb-6">
                    <div class="grid md:grid-cols-2 gap-4">
                        <Field v-model="editingUser.username" required label="Nom d'utilisateur" roundness="md"
                            :error="errors.username" @blur="touch('username')" />
                        <Field v-model="editingUser.email" required label="email" type="email" roundness="md"
                            :error="errors.email" @blur="touch('email')" />
                    </div>
                    <div class="grid md:grid-cols-2 gap-4">
                        <Field v-model="editingUser.first_name" label="Prénom" roundness="md" :error="errors.first_name"
                            @blur="touch('first_name')" />
                        <Field v-model="editingUser.last_name" label="Nom" roundness="md" :error="errors.last_name"
                            @blur="touch('last_name')" />
                    </div>
                </div>
            </section>
            <section>
                <h4 class="title-submain mb-6">Rôle et connexion</h4>
                <div class="flex flex-row flex-wrap gap-4 mb-6">
                    <div class="max-w-xs">
                        <Dropdown v-model="editingUser.status" required variant="light" size="md"
                            label="Status de l'utilisateur" placeholder="Status" :items="USER_STATUSES_OBJECTS"
                            @close="touch('status')" />
                    </div>
                </div>
                <div class="flex flex-row flex-wrap gap-4">
                    <div class="max-w-xs">
                        <Dropdown v-model="editingUser.role_id" required variant="light" size="md" label="Rôle"
                            placeholder="Rôle" :items="roles" label-key="name" value-key="id"
                            @close="touch('role_id')" />
                    </div>
                </div>
            </section>
            <section v-if="mode === 'edit'">
                <span class="text-sm text-gray-600"><strong>Date de dernière modification:</strong> {{
                    formatDateTime(editingUser.updated_at) }}</span>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RoleAttributes, UserAttributesFrontend } from '@brz/shared'
import { USER_STATUSES_OBJECTS, isEmail } from '@brz/shared'
import Field from '~/components/atoms/Field.vue'
import Button from '~/components/atoms/Button.vue'
import Loader from '~/components/molecules/Loader.vue'
import Dropdown from '~/components/molecules/Dropdown.vue'
import { formatDateTime } from '~/utils/date'

const props = withDefaults(defineProps<{
    initialUser: UserAttributesFrontend
    loading?: boolean
    roles: RoleAttributes[]
    mode: 'create' | 'edit'
}>(), {
    loading: false,
})

const emit = defineEmits<{
    save: [user: UserAttributesFrontend]
    delete: []
}>()

const editingUser = ref<UserAttributesFrontend>({ ...props.initialUser })

const { couldHaveErrors, hasErrors, touch, errors, submit } = useForm(
    ['username', 'email', 'first_name', 'last_name', 'status', 'role_id'],
    {
        username: () => editingUser.value.username === '' ? 'Le nom d\'utilisateur est requis' : null,
        email: () => editingUser.value.email === '' || !isEmail(editingUser.value.email) ? 'L\'e-mail est requis et doit être une adresse e-mail valide' : null,
        status: () => !editingUser.value.status ? 'Le status est requis' : null,
        role_id: () => !editingUser.value.role_id ? 'Le rôle est requis' : null,
    }
)

const handleSave = () => submit(() => {
    emit('save', editingUser.value)
})

const handleDelete = () => {
    emit('delete')
}
</script>