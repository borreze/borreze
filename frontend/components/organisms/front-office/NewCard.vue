<template>
    <component :is="clickable ? NuxtLink : 'div'" :to="clickable ? `/actualites/${post?.slug}` : undefined"
        class="block">
        <article
            :class="['group overflow-hidden rounded-lg bg-white shadow-md transition', clickable ? 'hover:shadow-xl' : '']">
            <div class="relative aspect-video overflow-hidden bg-gray-200">
                <NuxtImg :src="post?.cover ? mediaUrl(post?.cover.file_path) : MEDIA_URL_DEFAULT_CARD" :alt="post?.title || 'Actualité'"
                    :class="['h-full w-full object-cover transition', clickable ? 'group-hover:scale-105' : '']" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 from-0% to-black/10 to-30%" />
                <div v-if="post?.categories && post.categories.length > 0"
                    class="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2">
                    <Pill v-for="category in post.categories" :key="category.id" :label="category.name" size="sm"
                        variant="primary" />
                </div>
            </div>
            <div class="px-6 pb-6 pt-4">
                <div class="mb-2 text-sm text-gray-500">{{ formatDateRelative(post?.published_at) }} </div>
                <h3
                    :class="['mb-3 text-xl font-semibold text-dark transition line-clamp-1', clickable ? 'group-hover:text-primary' : '']">
                    {{ post?.title }}
                </h3>
                <p class="text-gray-600 line-clamp-2">
                    {{ post?.abstract }}
                </p>
            </div>
        </article>
    </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';
import type { PostAttributesFrontend } from '@brz/shared';
import { formatDateRelative } from '~/utils/date';
import Pill from '~/components/atoms/Pill.vue';
import { mediaUrl, MEDIA_URL_DEFAULT_CARD } from '~/utils/media';

const props = withDefaults(defineProps<{
    post: PostAttributesFrontend
    clickable?: boolean
}>(), {
    clickable: true
})

</script>