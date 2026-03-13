<template>
    <section id="home-quick-card">
        <NuxtLink :to="homeQuick?.url || '#'">
            <div class="group text-center">
                <div
                    class="transition group-hover:scale-110 duration-200 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
                    <Icon :name="homeQuick?.icon || 'ic:baseline-info'" size="2em" class="text-primary" />
                </div>
                <h3 class="text-xl font-semibold group-hover:text-primary transition-colors duration-200">{{
                    homeQuick?.title }}</h3>
                <p class="text-gray-600 text-sm">
                    {{ homeQuick?.description }}
                </p>
            </div>
        </NuxtLink>
    </section>
</template>

<script setup lang="ts">
import type { HomeQuickAttributes } from '@brz/shared';

const props = defineProps<{
    homeQuick?: HomeQuickAttributes | null
}>();

</script>