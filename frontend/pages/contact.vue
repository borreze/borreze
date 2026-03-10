<template>
    <div class="safe-area-md">
        <h1 class="title-main pt-2 pb-4">Contact</h1>
        <Breadcrumb :items="[{ name: 'Contact', path: '/contact' }]" />
        <div class="contact-grid mt-6">
            <section class="contact-form bg-white rounded-xl custom-shadow p-4 md:p-6 2xl:min-w-[500px]">
                <h4 class="title-submain">Formulaire de contact</h4>
                <div class="flex flex-col items-center justify-center space-y-4 mt-4">
                    <Field v-model="firstname" name="firstname" type="text" label="Prénom" roundness="lg"
                        placeholder="Jean" required :error="errors.firstname" @blur="touched.firstname = true" />
                    <Field v-model="lastname" name="lastname" type="text" label="Nom" roundness="lg"
                        placeholder="Dupont" required :error="errors.lastname" @blur="touched.lastname = true" />
                    <Field v-model="email" name="email" type="email" label="E-mail" roundness="lg"
                        placeholder="jdupont@gmail.com" required :error="errors.email" @blur="touched.email = true" />
                    <Field v-model="message" name="message" type="textarea" label="Message" roundness="lg"
                        placeholder="Votre message..." required :error="errors.message"
                        @blur="touched.message = true" />

                    <div class="flex flex-row align-items-center justify-end w-full">
                        <Button :disabled="Object.values(errors).some(Boolean)" icon="mdi-send" label="Envoyer"
                            position="right" variant="primary" size="md" @click="handleSubmit" />
                    </div>
                </div>
            </section>
            <section class="contact-address bg-white rounded-xl custom-shadow p-4 md:p-6 2xl:max-w-[400px]">
                <h4 class="title-submain">Adresse</h4>
                <address class="flex flex-col items-start gap-3 my-2">
                    <p>Mairie de Borrèze<br>
                        <span>51 grandrue, 24590 Borrèze</span>
                    </p>
                    <p>Horaires d'ouverture :<br>
                        <span v-html="nl2br(renderSchedules(schedules))"></span>
                    </p>
                    <Url icon="ic:baseline-email" to="mailto:mairie.borreze@orange.fr"
                        label="mairie.borreze@orange.fr" />
                    <Url icon="ic:baseline-phone" to="tel:0553288338" label="05 53 28 83 38" />
                </address>
            </section>
            <section class="contact-map bg-white rounded-xl custom-shadow">
                <ClientOnly>
                    <Map :zoom="15" :markers="[
                        {
                            position: [44.954197, 1.387597],
                            popup: {
                                label: 'Mairie de Borrèze',
                                content: '51 grandrue, 24590 Borrèze',
                            }
                        }
                    ]" class="rounded-xl" />
                </ClientOnly>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { push } from 'notivue';
import Breadcrumb from '~/components/molecules/Breadcrumb.vue';
import Button from '~/components/atoms/Button.vue'
import Field from '~/components/atoms/Field.vue'
import type { ScheduleAttributes } from '~/types/models/schedule';
import Url from '~/components/atoms/Url.vue';
import Map from '~/components/molecules/Map.client.vue';

const schedules = ref<ScheduleAttributes[]>([
    {
        id: 1,
        day: 'tuesday',
        intervals: [
            { start: '09:30', end: '12:00' },
            { start: '14:00', end: '17:00' }
        ]
    },
    {
        id: 2,
        day: 'wednesday',
        intervals: [
            { start: '14:00', end: '17:00' }
        ]
    },
    {
        id: 3,
        day: 'thursday',
        intervals: [
            { start: '09:30', end: '12:00' }
        ]
    },
    {
        id: 4,
        day: 'friday',
        intervals: [
            { start: '14:00', end: '17:00' }
        ]
    }
]);

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const message = ref('')

const touched = ref({
    firstname: false,
    lastname: false,
    email: false,
    message: false
})

const errors = computed(() => ({
    firstname:
        touched.value.firstname && firstname.value === ''
            ? 'Le champ prénom est requis'
            : null,
    lastname:
        touched.value.lastname && lastname.value === ''
            ? 'Le champ nom est requis'
            : null,
    email:
        touched.value.email && email.value === ''
            ? 'Le champ e-mail est requis'
            : touched.value.email && !isEmail(email.value)
                ? 'Le champ e-mail doit être une adresse e-mail valide'
                : null,
    message:
        touched.value.message && message.value === ''
            ? 'Le champ message est requis'
            : null
}))

const handleClear = () => {
    firstname.value = ''
    lastname.value = ''
    email.value = ''
    message.value = ''

    touched.value.firstname = false
    touched.value.lastname = false
    touched.value.email = false
    touched.value.message = false
}

const handleSubmit = async () => {
    // mark all as touched
    (Object.keys(touched.value) as Array<keyof typeof touched.value>).forEach((key) => (touched.value[key] = true))

    // stop if any error
    if (Object.values(errors.value).some(Boolean)) return

    firstname.value = firstname.value.trim()
    lastname.value = lastname.value.trim()
    email.value = email.value.trim()
    message.value = message.value.trim()

    // TODO: send contact message to backend

    handleClear()

    push.success({ title: 'Envoyé!', message: 'Votre demande a été envoyée avec succès.' })
}

onMounted(() => {
    window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKey)
})

function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
}

useAppHead({
    title: 'Contact',
    description: 'Page de contact de la commune de Borrèze.',
    url: '/contact'
})

definePageMeta({
    title: 'Contact',
    layout: 'front-office',
})

</script>

<style scoped>
.contact-grid {
    display: grid;
    grid-template-rows: auto;
    gap: 2rem;
}

.contact-grid .contact-form {
    grid-area: form;
}

.contact-grid .contact-address {
    grid-area: addr;
}

.contact-grid .contact-map {
    grid-area: map;
}

@media (min-width: 1536px) {
    .contact-grid {
        grid-template-areas:
            "map form addr";
        grid-template-columns: repeat(1, 1fr);
    }
}

@media (min-width: 1280px) and (max-width: 1535px) {
    .contact-grid {
        grid-template-areas:
            "form map"
            "addr map";
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) and (max-width: 1279px) {
    .contact-grid {
        grid-template-areas:
            "form map"
            "addr map";
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 768px) and (max-width: 1023px) {
    .contact-grid {
        grid-template-areas:
            "form addr"
            "map map";
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 640px) and (max-width: 767px) {
    .contact-grid {
        grid-template-areas:
            "addr"
            "form"
            "map";
        grid-template-columns: repeat(1, 1fr);
        gap: 1rem;
    }
}

@media (max-width: 639px) {
    .contact-grid {
        grid-template-areas:
            "form"
            "addr"
            "map";
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>