<template>
    <NuxtLink :to="result?._links.self_front">
        <article class="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-xl">
            <div class="p-6 flex flex-col gap-2">
                <span class="text-sm text-gray-500">
                    {{ result?._names.nice }}
                </span>
                <div class="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    <span class="text-xl font-semibold text-dark group-hover:text-primary transition line-clamp-1">
                        {{ result.title }}
                    </span>
                    <Icon name="ic:baseline-arrow-forward" size="1.5em" class="mt-1" />
                </div>  
            </div>
        </article>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { SearchResult } from '~/types/backend/search';

const props = defineProps<{
    result: SearchResult
}>();

</script>