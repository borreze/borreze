<template>
    <div>
        <div class="flex flex-col items-center justify-center space-y-4 mt-4 mx-4">
            <Field v-model="identifier" name="identifier" type="text" label="E-mail ou nom d'utilisateur"
                placeholder="jdupont@gmail.com" required :error="errors.identifier" @blur="touched.identifier = true" />

            <Field v-model="password" name="password" type="password" label="Mot de passe" placeholder="********"
                required :error="errors.password" @blur="touched.password = true" />
        </div>

        <div class="flex flex-row align-items-center justify-between m-4">
            <Button as="link" href="/" label="Revenir au site" variant="transparent" size="sm" />
            <Button label="Mot de passe oublié ?" variant="transparent" size="sm" @click="props.setTab('forgot')" />
        </div>

        <div class="flex flex-col space-y-4 m-4">
            <Button :disabled="Object.values(errors).some(Boolean)" label="Se connecter" variant="primary" size="md"
                :loading="authStore.loading" @click="handleLogin" />
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

const identifier = ref('')
const password = ref('')

const touched = ref({
    identifier: false,
    password: false
})

const errors = computed(() => ({
    identifier:
        touched.value.identifier && identifier.value === ''
            ? 'Le champ e-mail ou nom d\'utilisateur est requis'
            : null,
    password:
        touched.value.password && password.value === ''
            ? 'Le champ mot de passe est requis'
            : null
}))

const handleLogin = async () => {
    // mark all as touched
    (Object.keys(touched.value) as Array<keyof typeof touched.value>).forEach((key) => (touched.value[key] = true))

    // stop if any error
    if (Object.values(errors.value).some(Boolean)) return

    identifier.value = identifier.value.trim()
    password.value = password.value.trim()

    await authStore.login(identifier.value, password.value)

    if (authStore.error) {
        push.error(authStore.error)
    } else {
        push.success('Connexion réussie!')
        navigateTo('/back-office')
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKey)
})

function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter') handleLogin()
}

</script>
