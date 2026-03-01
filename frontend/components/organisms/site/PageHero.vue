<template>
    <section id="page-hero" class="relative h-[30vh] sm:h-[40vh] md:h-[40vh] lg:h-[50vh] min-h-[200px] overflow-hidden">
        <!-- Background image -->
        <NuxtImg :src="image" :alt="title" class="absolute inset-0 h-full w-full object-cover"
            loading="eager" />

        <!-- Dark overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/40 from-10% via-black/30 from-20% to-black/10 to-90%" />

        <!-- Content -->
        <div class="relative mx-auto flex h-full max-w-6xl items-center px-4 md:px-8">
            <div class="max-w-6xl text-white">
                <h1 v-if="title" class="title-hero-page">{{ title }} </h1>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

const props = defineProps<{
    title: string
    image: string
}>()


</script>