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
import HomeQuickCard from './HomeQuickCard.vue';
import { useHomeQuicks } from '~/composables/front-office/useHomeQuick';

const { homeQuicks } = await useHomeQuicks();

</script>