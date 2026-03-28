<template>
    <component :is="clickable ? NuxtLink : 'div'" :to="clickable ? `/evenements/${post?.slug}` : undefined"
        class="block">
        <article
            :class="['group overflow-hidden rounded-lg bg-white shadow-md transition', clickable ? 'hover:shadow-xl' : '']">
            <div class="relative aspect-[2/1] overflow-hidden bg-gray-200">
                <NuxtImg :src="post?.cover ? mediaUrl(post?.cover.file_path) : MEDIA_URL_DEFAULT_CARD"
                    :alt="post?.title || 'Événement'"
                    :class="['h-full w-full object-cover transition', clickable ? 'group-hover:scale-105' : '']" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div v-if="post?.categories && post.categories.length > 0"
                    class="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                    <Pill v-for="category in post.categories" :key="category.id" :label="category.name" size="sm"
                        variant="primary" />
                </div>
            </div>

            <div class="gap-4 px-5 pb-5 pt-4">
                <div class="flex gap-4">
                    <div v-if="eventDate"
                        class="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span class="text-xl font-bold leading-none">{{ eventDay }}</span>
                        <span class="text-[11px] font-semibold uppercase">{{ eventMonth }}</span>
                    </div>

                    <div class="min-w-0 flex-1">
                        <h3
                            :class="['text-lg font-semibold text-dark transition line-clamp-1', clickable ? 'group-hover:text-primary' : '']">
                            {{ post?.title }}
                        </h3>
                        <div class="mt-1 flex items-center gap-3 text-sm text-gray-500">
                            <span v-if="eventTime" class="flex items-center gap-1">
                                <Icon name="ic:outline-access-time" size="1em" />
                                {{ eventTime }}
                            </span>
                        </div>
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

const props = withDefaults(defineProps<{
    post: PostAttributesFrontend
    clickable?: boolean
}>(), {
    clickable: true
})

const eventDate = computed(() => props.post?.date_time ? new Date(props.post.date_time) : null)

const eventDay = computed(() => dateGetDay(eventDate.value as Date))
const eventMonth = computed(() => dateGetMonthShort(eventDate.value as Date))
const eventTime = computed(() => datetimeGetTime(eventDate.value as Date))

</script>