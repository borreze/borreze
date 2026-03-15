<template>
    <div>
        <div class="flex flex-col items-center justify-center space-y-4 mt-4 mb-6 mx-4">
            <Field v-model="formContent.identifier" name="identifier" type="text" label="E-mail ou nom d'utilisateur"
                placeholder="jdupont@gmail.com" required :error="errors.identifier" @blur="touch('identifier')" />
            <Field v-model="formContent.password" name="password" type="password" label="Mot de passe"
                placeholder="********" required :error="errors.password" @blur="touch('password')" />
        </div>

        <div class="flex flex-col space-y-4 m-4">
            <Button :disabled="hasErrors" label="Se connecter" variant="primary" size="md" :loading="authStore.loading"
                @click="handleLogin" />
            <Button as="link" href="/" icon="ic:baseline-arrow-back" label="Revenir au site web" variant="ghost"
                size="md" />
        </div>
    </div>
</template>


<script setup lang="ts">
import { push } from 'notivue'
import Button from '~/components/atoms/Button.vue'
import Field from '~/components/atoms/Field.vue'

const props = defineProps<{
    setTab: Function
}>()

const authStore = useAuthStore()

const formContent = ref<{
    identifier: string;
    password: string;
}>({
    identifier: '',
    password: '',
})

const { touch, hasErrors, errors, submit } = useForm(
    ['identifier', 'password'],
    {
        identifier: () => formContent.value.identifier === '' ? 'Le nom d\'utilisateur ou l\'e-mail est requis' : null,
        password: () => formContent.value.password === '' ? 'Le mot de passe est requis' : null,
    }
)

const handleLogin = () => submit(async () => {
    // trim values
    formContent.value.identifier = formContent.value.identifier.trim()
    formContent.value.password = formContent.value.password.trim()

    await authStore.login(formContent.value.identifier, formContent.value.password)

    if (authStore.error) {
        push.error(authStore.error)
    } else {
        push.success('Connexion réussie!')
        navigateTo('/back-office')
    }
})

onMounted(() => {
    window.addEventListener('keydown', handleKey)
    authStore.loading = false
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKey)
})

function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter') handleLogin()
}

</script>
