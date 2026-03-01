<template>
    <section id="home-starry-village" class="py-16">
        <div class="container mx-auto px-4 text-center">
            <div class="max-w-3xl mx-auto">
                <div class="mb-8 flex items-center justify-center gap-4">
                    <AppStarryVillage />
                </div>
                <h2 class="text-3xl font-bold mb-6">
                    Borrèze, Village Étoilé
                </h2>
                <p class="text-lg text-dark mb-8">
                    Notre commune est labellisée "Village Étoilé" pour son engagement dans la préservation
                    de la qualité du ciel nocturne et la lutte contre la pollution lumineuse.
                    Un engagement pour les générations futures.
                </p>
                <div class="grid md:grid-cols-3 gap-8 mt-12">
                    <div>
                        <div class="flex items-center justify-center gap-1 mt-1.5 mb-3">
                            <Icon v-for="n in starsCount" :key="n" name="ic:round-star" size="2em"
                                class="text-[#FFD800]" />
                            <Icon v-for="n in starsMax - starsCount" :key="n" name="ic:round-star-border" size="2em"
                                class="text-gray-300" />
                        </div>
                        <div class="text-sm text-gray-400">Label {{ starsCount }} étoiles</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-primary mb-2">100%</div>
                        <div class="text-sm text-gray-400">Éclairage LED</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-primary mb-2">-60%</div>
                        <div class="text-sm text-gray-400">Consommation énergétique</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import AppStarryVillage from './AppStarryVillage.vue';

const starsCount: number = 4;
const starsMax: number = 5;

</script>