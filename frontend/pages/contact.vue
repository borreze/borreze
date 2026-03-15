<template>
    <div class="safe-area-md">
        <h1 class="title-main pt-2 pb-4">Contact</h1>
        <Breadcrumb :items="[{ name: 'Contact', path: '/contact' }]" />
        <div class="contact-grid mt-6">
            <section
                class="contact-form bg-white rounded-xl shadow-[2px_2px_10px_2px_#0000001a] p-4 md:p-6 2xl:min-w-[500px]">
                <h4 class="title-submain">Formulaire de contact</h4>
                <div class="flex flex-col items-center justify-center space-y-4 mt-4">
                    <Field v-model="formContent.firstname" name="firstname" type="text" label="Prénom" roundness="lg"
                        placeholder="Jean" required :error="errors.firstname" @blur="touch('firstname')" />
                    <Field v-model="formContent.lastname" name="lastname" type="text" label="Nom" roundness="lg"
                        placeholder="Dupont" required :error="errors.lastname" @blur="touch('lastname')" />
                    <Field v-model="formContent.email" name="email" type="email" label="E-mail" roundness="lg"
                        placeholder="jdupont@gmail.com" required :error="errors.email" @blur="touch('email')" />
                    <Field v-model="formContent.message" name="message" type="textarea" label="Message" roundness="lg"
                        placeholder="Votre message..." required :error="errors.message" @blur="touch('message')" />

                    <div class="flex flex-row align-items-center justify-end w-full">
                        <Button :disabled="hasErrors" icon="mdi-send" label="Envoyer" position="right" variant="primary"
                            size="md" @click="handleSubmit" />
                    </div>
                </div>
            </section>
            <section
                class="contact-address bg-white rounded-xl shadow-[2px_2px_10px_2px_#0000001a] p-4 md:p-6 2xl:max-w-[400px]">
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
            <section class="contact-map bg-white rounded-xl shadow-[2px_2px_10px_2px_#0000001a]">
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
import { isEmail, type ScheduleAttributes } from '@brz/shared';
import Url from '~/components/atoms/Url.vue';
import Map from '~/components/molecules/Map.client.vue';
import { nl2br, renderSchedules } from '#imports';

const schedules = ref<ScheduleAttributes[]>([
    {
        id: 1,
        type: 'town_hall',
        day: 'tuesday',
        intervals: [
            { start: '09:30', end: '12:00' },
            { start: '14:00', end: '17:00' }
        ]
    },
    {
        id: 2,
        type: 'town_hall',
        day: 'wednesday',
        intervals: [
            { start: '14:00', end: '17:00' }
        ]
    },
    {
        id: 3,
        type: 'town_hall',
        day: 'thursday',
        intervals: [
            { start: '09:30', end: '12:00' }
        ]
    },
    {
        id: 4,
        type: 'town_hall',
        day: 'friday',
        intervals: [
            { start: '14:00', end: '17:00' }
        ]
    }
]);

const formContent = ref<{
    firstname: string;
    lastname: string;
    email: string;
    message: string;
}>({
    firstname: '',
    lastname: '',
    email: '',
    message: ''
})

const { touch, hasErrors, touched, errors, untouchAll, submit } = useForm(
    ['firstname', 'lastname', 'email', 'message'],
    {
        firstname: () => formContent.value.firstname === '' ? 'Le titre est requis' : null,
        lastname: () => formContent.value.lastname === '' ? 'Le slug est requis' : null,
        email: () => formContent.value.email === '' || !isEmail(formContent.value.email) ? 'Le champ e-mail est requis et doit être une adresse e-mail valide' : null,
        message: () => formContent.value.message === '' ? 'Le champ message est requis' : null,
    }
)

const handleClear = () => {
    formContent.value.firstname = ''
    formContent.value.lastname = ''
    formContent.value.email = ''
    formContent.value.message = ''
    untouchAll()
}

const handleSubmit = () => submit(async () => {
    // trim values
    formContent.value.firstname = formContent.value.firstname.trim()
    formContent.value.lastname = formContent.value.lastname.trim()
    formContent.value.email = formContent.value.email.trim()
    formContent.value.message = formContent.value.message.trim()

    // TODO: send contact message to backend

    handleClear()

    push.success({ title: 'Envoyé!', message: 'Votre demande a été envoyée avec succès.' })
})

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