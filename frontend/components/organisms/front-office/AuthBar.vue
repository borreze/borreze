<template>
    <div class="fixed -bottom-2 2xl:bottom-1/2 right-4 -translate-y-1/2 z-30">
        <NuxtLink to="/back-office/authentification" class="group flex items-center justify-start">
            <div
                class="p-3 rounded-full flex items-center justify-center cursor-pointer shadow-lg bg-primary border-2 border-primary text-white hover:brightness-90">
                <Icon name="ic:baseline-admin-panel-settings" size="1.5rem" class="text-white text-xl" />
            </div>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const project = config.public.project

</script>