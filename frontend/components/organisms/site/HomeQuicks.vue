<template>
    <section id="home-quicks" class="py-16">
        <div class="mx-auto max-w-6xl md:max-w-none px-4 md:px-8">
            <div class="flex flex-wrap justify-center gap-6 lg:gap-8 lg:gap-12">
                <HomeQuickCard v-for="homeQuick in homeQuicks" :key="homeQuick.id" :home-quick="homeQuick"
                    class="max-w-[150px] md:max-w-[200px] lg:max-w-[300px]" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { HomeQuickAttributes } from '~/types/models/homeQuick';
import HomeQuickCard from './HomeQuickCard.vue';

const homeQuicks = ref<HomeQuickAttributes[]>([
    {
        id: 1,
        order: 0,
        is_visible: true,
        title: 'École',
        icon: 'ic:baseline-school',
        description: 'Informations sur les écoles et inscriptions',
        url: '/ecole',
    },
    {
        id: 2,
        order: 1,
        is_visible: true,
        title: 'Événements',
        icon: 'ic:baseline-event',
        description: 'Vie associative et culturelle',
        url: '/evenements',
    },
    {
        id: 3,
        order: 2,
        is_visible: true,
        title: 'Projets',
        icon: 'ic:baseline-construction',
        description: 'Développement et aménagements',
        url: '/projets',
    },
    {
        id: 4,
        order: 3,
        is_visible: true,
        title: 'Actualités',
        icon: 'ic:baseline-newspaper',
        description: 'Dernières nouvelles du village',
        url: '/actualites',
    },
    {
        id: 5,
        order: 4,
        is_visible: true,
        title: 'Services',
        icon: 'ic:baseline-build',
        description: 'Services municipaux et démarches administratives',
        url: '/services',
    },
]);

</script>