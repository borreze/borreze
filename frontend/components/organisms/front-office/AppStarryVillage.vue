<template>
    <NuxtLink to="https://www.anpcen.fr/?id_rub=19" external target="_blank">
        <NuxtImg src="images/villages-etoiles-4.webp" :alt="`${project.name} est un village étoilés`" height="75" />
    </NuxtLink>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const project = config.public.project

</script>