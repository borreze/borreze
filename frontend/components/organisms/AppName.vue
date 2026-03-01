<template>
    <NuxtLink :to="to" class="select-none flex-none flex items-center">
        <NuxtImg src="/logo.svg" :alt="`Logo de ${project.name}`" class="mr-2 size-6 md:size-7 lg:size-8" />
        <span class="text-2xl md:text-3xl lg:text-4xl font-bold century-gothic-bold text-dark">{{ project.name
            }}</span>
    </NuxtLink>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const project = config.public.project

const props = defineProps<{
    to: string
}>();

</script>