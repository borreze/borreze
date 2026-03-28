<template>
    <HomeHero />
    <HomeQuicks />
    <HomeSummary />
    <HomeNews />
    <HomeEvents />
    <HomeStarryVillage />
</template>

<script setup lang="ts">
import HomeHero from '~/components/organisms/front-office/HomeHero.vue';
import HomeQuicks from '~/components/organisms/front-office/HomeQuicks.vue';
import HomeSummary from '~/components/organisms/front-office/HomeSummary.vue';
import HomeNews from '~/components/organisms/front-office/HomeNews.vue';
import HomeEvents from '~/components/organisms/front-office/HomeEvents.vue';
import HomeStarryVillage from '~/components/organisms/front-office/HomeStarryVillage.vue';

useAppHead({}) // Defaulting

definePageMeta({
    title: 'Accueil',
    layout: 'front-office',
})
</script>