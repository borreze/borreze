<template>
    <section v-if="posts?.length > 0" id="home-events" class="py-16 bg-gray-50">
        <div class="mx-auto max-w-6xl px-4 md:px-8">
            <div class="mb-8 flex items-end justify-between">
                <div>
                    <h2 class="title-main mb-2">
                        Prochains événements
                    </h2>
                    <p class="text-gray-600">
                        Participez à la vie du village
                    </p>
                </div>
                <NuxtLink to="/evenements"
                    class="hidden sm:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                    <span>Voir tous les événements</span>
                    <Icon name="ic:baseline-arrow-forward" class="mt-1" />
                </NuxtLink>
            </div>

            <div class="space-y-4">
                <NuxtLink v-for="post in posts" :key="post.id" :to="`/evenements/${post.slug}`"
                    class="group flex gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md sm:gap-6">
                    <DateSquare :dateTime="post.date_time" />

                    <div v-if="post.cover"
                        class="hidden h-14 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-200 md:block">
                        <NuxtImg :src="mediaUrl(post.cover.file_name)" :alt="post.title"
                            class="h-full w-full object-cover transition group-hover:scale-105" />
                    </div>

                    <div class="flex min-w-0 flex-1 flex-col justify-center">
                        <div class="mb-1 flex flex-wrap items-center gap-2">
                            <Pill v-for="category in post.categories" :key="category.id" :label="category.name"
                                size="sm" variant="primary" />
                        </div>
                        <h3
                            class="text-base font-semibold text-dark transition group-hover:text-primary sm:text-lg line-clamp-1">
                            {{ post.title }}
                        </h3>
                        <p class="mt-0.5 text-sm text-gray-500 line-clamp-1">
                            {{ post.abstract }}
                        </p>
                    </div>

                    <div class="hidden items-center text-gray-300 transition group-hover:text-primary sm:flex">
                        <Icon name="ic:baseline-arrow-forward" size="1.5em" />
                    </div>
                </NuxtLink>
            </div>

            <div class="mt-8 flex justify-center">
                <NuxtLink to="/evenements"
                    class="mt-4 inline-flex sm:hidden items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                    <span>Voir tous les événements</span>
                    <Icon name="ic:baseline-arrow-forward" class="mt-1" />
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import Pill from '~/components/atoms/Pill.vue';
import DateSquare from '~/components/molecules/DateSquare.vue';
import { usePostsFuture } from '~/composables/front-office/usePost';
import { mediaUrl } from '~/utils/media';

const { posts, loading } = await usePostsFuture('event')
</script>