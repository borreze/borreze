<template>
    <NuxtLink :to="`/actualites/${post?.slug}`" class="block">
        <article class="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-xl">
            <div class="aspect-video overflow-hidden bg-gray-200">
                <NuxtImg src="https://picsum.photos/400/300?random=1" alt="Actualité"
                    class="h-full w-full object-cover transition group-hover:scale-105" />
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between">
                    <div class="mb-2 text-sm text-gray-500">{{ formatDateRelativeNice(post?.published_at) }}
                    </div>
                    <div v-if="post?.categories && post.categories.length > 0"
                        class="flex items-center flex-wrap gap-2">
                        <Pill v-for="category in post.categories" :key="category.id" :label="category.name" size="sm"
                            variant="primary" />
                    </div>
                </div>
                <h3 class="mb-3 text-xl font-semibold text-gray-900 group-hover:text-primary transition line-clamp-1">
                    {{ post?.title }}
                </h3>
                <p class="text-gray-600 line-clamp-2">
                    {{ post?.abstract }}
                </p>
            </div>
        </article>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { PostAttributes } from '~/types/models/post';
import { formatDateRelativeNice } from '~/utils/date';
import Pill from '~/components/atoms/Pill.vue';

const props = defineProps<{
    post: PostAttributes
}>();

</script>