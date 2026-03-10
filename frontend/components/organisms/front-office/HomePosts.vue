<template>
    <section v-if="posts?.length > 0" id="home-posts" class="py-16">
        <div class="mx-auto max-w-6xl px-4 md:px-8">
            <div class="mb-8 flex items-end justify-between">
                <div>
                    <h2 class="title-main mb-2">
                        Dernières actualités
                    </h2>
                    <p class="text-gray-600">
                        Restez informé de la vie du village
                    </p>
                </div>
                <NuxtLink to="/actualites"
                    class="hidden sm:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                    <span>Voir toutes les actualités</span>
                    <Icon name="ic:baseline-arrow-forward" class="mt-1" />
                </NuxtLink>
            </div>

            <Grid v-if="posts?.length > 0" :items="posts">
                <template #item="{ item }">
                    <PostCard :post="item" />
                </template>
            </Grid>

            <div class="mt-8 flex justify-center">
                <NuxtLink to="/actualites"
                    class=" mt-4 inline-flex sm:hidden  items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                    <span>Voir toutes les actualités</span>
                    <Icon name="ic:baseline-arrow-forward" class="mt-1" />
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import Grid from '~/components/molecules/Grid.vue';
import PostCard from './PostCard.vue';
import { usePostsRecents } from '~/composables/front-office/usePost';

const { posts, loading } = await usePostsRecents()

</script>