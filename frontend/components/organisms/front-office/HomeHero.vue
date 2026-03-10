<template>
    <section id="home-hero" class="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] min-h-[500px] overflow-hidden">
        <!-- Background image -->
        <NuxtImg src="/images/borreze-place.webp" alt="Village de Borrèze"
            class="absolute inset-0 h-full w-full object-cover" loading="eager" />

        <!-- Dark overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/40 from-10% via-black/30 from-20% to-black/10 to-90%" />

        <!-- Content -->
        <div class="relative mx-auto flex h-full max-w-6xl items-center px-4 md:px-8">
            <div class="max-w-2xl text-white">
                <h1 class="mb-4 title-hero-home">
                    Borrèze
                </h1>
                <p class="mb-8 text-xl md:text-2xl opacity-95">
                    Lorem ipsum dolor sit amet, consectetur adipisicing.
                </p>

                <div class="flex flex-col md:flex-col-reverse gap-4">
                    <div class="bg-white/20 rounded-full p-2">
                        <div class="flex-1 flex gap-2">
                            <Field class="flex-1" v-model="searchQuery" name="searchHero"
                                :placeholder="isMobile() ? 'Rechercher...' : 'Rechercher une information, une actualité...'"
                                icon="ic:baseline-search" size="md" />
                            <Button class="flex" type="button" label="Rechercher" variant="blur" size="md"
                                roundness="full" @click="handleSearch" />
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <Button as="link" label="Découvrez le village" href="#home-summary" variant="primary" size="md"
                            roundness="full" icon="ic:baseline-arrow-forward" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 custom-bounce">
            <Icon name="ic:baseline-keyboard-arrow-down" size="3em" class="text-white opacity-70" />
        </div>
    </section>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue';
import Field from '~/components/atoms/Field.vue';
import { isMobile } from '#imports';

const searchQuery = ref('')

function handleSearch() {
    goToSearchPage(searchQuery.value)
}

</script>

<style scoped>
.custom-bounce {
    animation: bounce 3s infinite linear;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }

    50% {
        transform: none;
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
}
</style>