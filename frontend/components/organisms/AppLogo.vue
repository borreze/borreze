<template>
    <NuxtLink :to="to" class="select-none flex-none flex items-center">
        <NuxtImg src="/logo.svg" :alt="`Logo de ${project.name}`" width="75" />
    </NuxtLink>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const project = config.public.project

const props = defineProps<{
    to: string
}>();

</script>