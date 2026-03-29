<template>
    <PageHero v-if="post" :title="post?.title" :image="post?.cover ? mediaUrl(post?.cover.file_path) : MEDIA_URL_DEFAULT_HERO" />
    <section class="safe-area-md">
        <div class="mx-auto max-w-6xl">
            <Breadcrumb :items="[
                { name: 'Actualités', url: '/actualites' },
                ...(post ? [{ name: post.title, url: `/actualites/${post.slug}` }] : [])
            ]" />
            <div v-if="post?.categories && post.categories.length > 0" class="mt-8 flex items-center flex-wrap gap-2">
                <Pill v-for="category in post.categories" :key="category.id" :label="category.name" size="md"
                    variant="primary" />
            </div>
            <Loader v-if="loading" />
            <article v-else-if="post" class="mt-8">
                <p v-if="post.published_at" class="text-sm text-gray-500 mt-2">
                    {{ formatDateRelative(post.published_at) }}
                </p>
                <p v-if="post.abstract" class="mt-4 text-gray-600 italic">{{ post.abstract }}</p>
                <WysiwygRenderer v-if="post.content" class="mt-6 prose max-w-none" :html="post.content" />
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
import Pill from '~/components/atoms/Pill.vue'
import Loader from '~/components/molecules/Loader.vue'
import Breadcrumb from '~/components/molecules/Breadcrumb.vue'
import { usePost } from '~/composables/front-office/usePost';
import PageHero from '~/components/organisms/front-office/PageHero.vue';
import { formatDateRelative } from '~/utils/date';
import { mediaUrl, MEDIA_URL_DEFAULT_HERO } from '~/utils/media';
import WysiwygRenderer from '~/components/organisms/WysiwygRenderer.vue';

const route = useRoute()
const { post, loading } = await usePost('new', route.params.slug as string)

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Actualité introuvable' })
}

useAppHead({
    title: post.value.meta_title ?? post.value.title,
    description: post.value.meta_description ?? post.value.abstract,
    url: `/actualites/${post.value.slug}`,
})

definePageMeta({
    title: 'Actualité',
    layout: 'front-office',
})


</script>