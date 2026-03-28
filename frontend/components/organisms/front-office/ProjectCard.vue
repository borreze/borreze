<template>
    <component :is="clickable ? NuxtLink : 'div'" :to="clickable ? `/projets/${post?.slug}` : undefined" class="block">
        <article
            :class="['group overflow-hidden rounded-lg bg-white shadow-md transition', clickable ? 'hover:shadow-xl' : '']">
            <div class="relative h-40 overflow-hidden bg-gray-200">
                <NuxtImg :src="post?.cover ? mediaUrl(post?.cover.file_path) : MEDIA_URL_DEFAULT_CARD"
                    :alt="post?.title || 'Projet'"
                    :class="['h-full w-full object-cover transition', clickable ? 'group-hover:scale-105' : '']" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <!-- Titre sur l'image -->
                <div class="absolute bottom-3 left-4 right-4 z-10">
                    <h3 class="text-lg font-semibold text-white line-clamp-1 drop-shadow-sm">
                        {{ post?.title }}
                    </h3>
                </div>
            </div>

            <div class="px-4 pb-4 pt-3">
                <div class="mb-3 flex flex-wrap items-center gap-2">
                    <Pill v-if="post?.progression"
                        :label="POST_PROGESSIONS_OBJECTS.find(prog => prog.value === post?.progression)?.label || post?.progression"
                        :color="POST_PROGESSIONS_OBJECTS.find(prog => prog.value === post?.progression)?.color"
                        size="sm" />
                    <Pill v-for="category in post?.categories" :key="category.id" :label="category.name" size="sm"
                        variant="primary" />
                </div>

                <div v-if="post?.progression" class="mb-3">
                    <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div class="h-full rounded-full transition-all duration-500"
                            :style="{ width: `${(POST_PROGESSIONS_OBJECTS.find(p => p.value === post?.progression)?.percent ?? 0)}%`, backgroundColor: (POST_PROGESSIONS_OBJECTS.find(p => p.value === post?.progression)?.color ?? '#d1d5db') }" />
                    </div>
                </div>

                <p class="text-sm text-gray-600 line-clamp-2">
                    {{ post?.abstract }}
                </p>

                <div class="mt-3 text-xs text-gray-400">{{ formatDateRelative(post?.published_at) }}</div>
            </div>
        </article>
    </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';
import { POST_PROGESSIONS_OBJECTS, type PostAttributesFrontend } from '@brz/shared';
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