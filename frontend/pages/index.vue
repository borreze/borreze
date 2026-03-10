<template>
    <HomeHero />
    <HomeQuicks />
    <HomeSummary />
    <HomePosts />
    <HomeStarryVillage />
</template>

<script setup lang="ts">
import HomeHero from '~/components/organisms/front-office/HomeHero.vue';
import HomeQuicks from '~/components/organisms/front-office/HomeQuicks.vue';
import HomeSummary from '~/components/organisms/front-office/HomeSummary.vue';
import HomePosts from '~/components/organisms/front-office/HomePosts.vue';
import HomeStarryVillage from '~/components/organisms/front-office/HomeStarryVillage.vue';

useAppHead({}) // Defaulting

definePageMeta({
    title: 'Accueil',
    layout: 'front-office',
})
</script>