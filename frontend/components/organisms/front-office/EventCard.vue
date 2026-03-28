<template>
    <component :is="clickable ? NuxtLink : 'div'" :to="clickable ? `/evenements/${post?.slug}` : undefined"
        class="block">
        <article
            :class="['group overflow-hidden rounded-lg bg-white shadow-md transition', clickable ? 'hover:shadow-xl' : '']">
            <div class="relative aspect-[2/1] overflow-hidden bg-gray-200">
                <NuxtImg :src="post?.cover ? mediaUrl(post?.cover.file_path) : MEDIA_URL_DEFAULT_CARD"
                    :alt="post?.title || 'Événement'"
                    :class="['h-full w-full object-cover transition', clickable ? 'group-hover:scale-105 group-hover:grayscale-0' : '', !isInFuture(post?.date_time) ? 'grayscale' : '']" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div v-if="!isInFuture(post?.date_time)"
                    class="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                    <span class="rounded-full px-4 py-1.5 text-sm font-semibold text-light">
                        Cet événement a déjà eu lieu
                    </span>
                </div>

                <div v-if="post?.categories && post.categories.length > 0"
                    class="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                    <Pill v-for="category in post.categories" :key="category.id" :label="category.name" size="sm"
                        variant="primary" />
                </div>
            </div>

            <div class="gap-4 px-5 pb-5 pt-4">
                <div class="flex gap-4">
                    <DateSquare :dateTime="post.date_time" :color="isInFuture(post.date_time) ? 'primary' : 'gray'" />
                    <div class="min-w-0 flex-1">
                        <h3
                            :class="['text-lg font-semibold text-dark transition line-clamp-1', clickable ? 'group-hover:text-primary' : '']">
                            {{ post?.title }}
                        </h3>
                        <TimeText :dateTime="post.date_time" />
                    </div>
                </div>
                <p class="mt-1.5 text-sm text-gray-600 line-clamp-2">
                    {{ post?.abstract }}
                </p>
            </div>
        </article>
    </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';
import type { PostAttributesFrontend } from '@brz/shared';
import Pill from '~/components/atoms/Pill.vue';
import { mediaUrl, MEDIA_URL_DEFAULT_CARD } from '~/utils/media';
import { computed } from 'vue';
import DateSquare from '~/components/molecules/DateSquare.vue';
import TimeText from '~/components/molecules/TimeText.vue';

const props = withDefaults(defineProps<{
    post: PostAttributesFrontend
    clickable?: boolean
}>(), {
    clickable: true
})

</script>