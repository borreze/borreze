<template>
    <HomeHero />
    <HomeQuicks />
    <HomeSummary />
    <HomePosts />
    <HomeStarryVillage />
</template>

<script setup lang="ts">
import HomeHero from '~/components/organisms/site/HomeHero.vue';
import HomeQuicks from '~/components/organisms/site/HomeQuicks.vue';
import HomeSummary from '~/components/organisms/site/HomeSummary.vue';
import HomePosts from '~/components/organisms/site/HomePosts.vue';
import HomeStarryVillage from '~/components/organisms/site/HomeStarryVillage.vue';

useAppHead({}) // Defaulting

definePageMeta({
    title: 'Accueil',
})
</script>