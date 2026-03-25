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
                        <Button :disabled="couldHaveErrors" icon="mdi-send" label="Envoyer" position="right"
                            variant="primary" size="md" @click="handleSubmit" />
                    </div>
                </div>
            </section>
            <section
                class="contact-address bg-white rounded-xl shadow-[2px_2px_10px_2px_#0000001a] p-4 md:p-6 2xl:max-w-[400px]">
                <h4 class="title-submain">Adresse</h4>
                <address class="flex flex-col items-start gap-3 my-2">
                    <p>Mairie de Borrèze<br>51 grandrue, 24590 Borrèze</p>
                    <p v-if="schedules.length">Horaires d'ouverture :<br>
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
import { isEmail, parseValidationErrors, type ContactRequest, type ScheduleAttributes } from '@brz/shared';
import Url from '~/components/atoms/Url.vue';
import Map from '~/components/molecules/Map.client.vue';
import { nl2br, renderSchedules } from '#imports';
import { useContact } from '~/composables/front-office/useContact';
import { useSchedulesByType } from '~/composables/front-office/useSchedule';

const { schedules } = await useSchedulesByType('town_hall');
const { sendContact } = useContact()

const formContent = ref<ContactRequest>({
    firstname: '',
    lastname: '',
    email: '',
    message: ''
})

const { couldHaveErrors, touch, touched, errors, untouchAll, submit } = useForm(
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
    try {
        await sendContact(formContent.value)
        handleClear()
        push.success({ title: 'Envoyé!', message: 'Votre demande a été envoyée avec succès.' })
    } catch (err: any) {
        push.error(parseValidationErrors(err?.data))
    }
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