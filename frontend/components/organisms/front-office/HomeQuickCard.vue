<template>
    <component :is="clickable ? NuxtLink : 'div'" :to="clickable ? homeQuick?.url : undefined"
        :external="homeQuick?.url?.startsWith('http') || false">
        <div class=" group text-center">
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
    </component>
</template>

<script setup lang="ts">
import type { HomeQuickAttributes } from '@brz/shared';
import { NuxtLink } from '#components';

const props = withDefaults(defineProps<{
    homeQuick: HomeQuickAttributes
    clickable?: boolean
}>(), {
    clickable: true
})


</script>