<template>
    <footer class="bg-white text-dark shadow-lg mt-20 px-5 py-10">
        <div
            class="mx-auto w-full xl:w-10/12 2xl:w-8/12 grid grid-cols-12 gap-x-2 gap-y-16 md:gap-8 lg:gap-x-10 lg:gap-y-16">
            <div class="col-span-12 flex justify-center items-center gap-8 flex">
                <AppLogo to="/" />
                <AppStarryVillage />
            </div>
            <div class="col-span-12 md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start">
                <h4 class="text-lg century-gothic-bold mb-3">Suivez-nous</h4>
                <div class="flex flex-col items-start gap-2">
                    <SocialCard v-for="social in socials" :key="social.id" :social="social" />
                </div>
            </div>
            <div class="col-span-12 md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start">
                <h4 class="text-lg century-gothic-bold mb-3">Pages utiles</h4>
                <div class="flex flex-col items-start gap-2">
                    <Url to="/" label="Accueil" :bold="false" />
                    <Url to="/contact" label="Contact" :bold="false" />
                    <Url to="/plan-du-site" label="Plan du site" :bold="false" />
                    <Url to="/pages/mentions-legales" label="Mentions légales" :bold="false" />
                    <Url to="/pages/politique-de-confidentialite" label="Politique de confidentialité" :bold="false" />
                </div>
            </div>
            <div class="col-span-12 md:col-span-4 flex flex-col items-center md:items-start gap-3">
                <Button as="link" label="Nous contacter" icon="ic:baseline-email" href="/contact" variant="primary"
                    size="md" class="mb-2" />
                <address class="flex flex-col items-start gap-3">
                    <p>Mairie de Borrèze<br>
                        <span>51 grandrue, 24590 Borrèze</span>
                    </p>
                    <Url icon="ic:baseline-email" to="mailto:mairie.borreze@orange.fr"
                        label="mairie.borreze@orange.fr" />
                    <Url icon="ic:baseline-phone" to="tel:0553288338" label="05 53 28 83 38" />
                    <p>Horaires d'ouverture :<br>
                        <span v-html="nl2br(renderSchedules(schedules))"></span>
                    </p>
                </address>
            </div>
            <div class="col-span-12 text-center text-sm text-gray-400">
                <span>
                    <NuxtLink to="https://anthonylalba.com/" external target="_blank"
                        class=" hover:text-gray-500 transition-colors duration-300">Site internet crée par Anthony Lalba
                    </NuxtLink>
                </span>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import AppLogo from '~/components/organisms/AppLogo.vue'
import Button from '~/components/atoms/Button.vue';
import AppStarryVillage from './AppStarryVillage.vue';
import type { ScheduleAttributes } from '~/types/backend/schedule';
import type { SocialAttributes } from '~/types/social';
import SocialCard from '~/components/organisms/front-office/SocialCard.vue';
import Url from '~/components/atoms/Url.vue';

const socials = ref<SocialAttributes[]>([
    {
        id: 1,
        type: 'facebook',
        pseudo: 'MairiedeBorreze'
    },
    {
        id: 2,
        type: 'instagram',
        pseudo: 'borreze'
    }
]);

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

</script>