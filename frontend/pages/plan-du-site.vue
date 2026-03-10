<template>
    <div class="safe-area-md">
        <h1 class="title-main pt-2 pb-4">Plan du site</h1>
        <Breadcrumb :items="[{ name: 'Plan du site', path: '/plan-du-site' }]" />
        <div class="mt-6 flex flex-col">
            <Url v-for="route in publicRoutes" :key="route.path" :to="route.path"
                :label="(route.meta?.title as string) || route.path" :bold="false" class="block mb-2" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Url from '~/components/atoms/Url.vue'
import Breadcrumb from '~/components/molecules/Breadcrumb.vue'

const publicRoutes = computed(() => {
    const routes = getRoutes({ publicOnly: true })
    return routes
})

useAppHead({
    title: 'Plan du site',
    url: '/plan-du-site',
    noindex: true
})

definePageMeta({
    title: 'Plan du site',
    layout: 'front-office',
})

</script>