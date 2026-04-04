<template>
    <PageHero v-if="post" :title="post?.title"
        :image="post?.cover ? mediaUrl(post?.cover.file_name) : MEDIA_URL_DEFAULT_HERO" />
    <section class="safe-area-md">
        <div class="mx-auto max-w-6xl">
            <Breadcrumb :items="[
                ...(post ? [{ name: post.title, url: `/pages/${post.slug}` }] : [])
            ]" />

            <Loader v-if="loading" />
            <article v-else-if="post" class="mt-8">
                <div v-if="post?.medias" class="mt-4">
                    <MediaCarousel :medias="post.medias" class="h-[400px] max-w-[800px] mx-auto" />
                </div>

                <p v-if="post.abstract" class="mt-4 text-gray-600 italic">{{ post.abstract }}</p>

                <WysiwygRenderer v-if="post.content" class="mt-6 prose max-w-none" :html="post.content" />
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
import Loader from '~/components/molecules/Loader.vue'
import Breadcrumb from '~/components/molecules/Breadcrumb.vue'
import { usePost } from '~/composables/front-office/usePost';
import PageHero from '~/components/organisms/front-office/PageHero.vue';
import { formatDateRelative } from '~/utils/date';
import { mediaUrl, MEDIA_URL_DEFAULT_HERO } from '~/utils/media';
import WysiwygRenderer from '~/components/organisms/WysiwygRenderer.vue';
import MediaCarousel from '~/components/organisms/front-office/MediaCarousel.vue';

const route = useRoute()
const { post, loading } = await usePost('page', route.params.slug as string)

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page introuvable' })
}

useAppHead({
    title: post.value.meta_title ?? post.value.title,
    description: post.value.meta_description ?? post.value.abstract,
    url: `/pages/${post.value.slug}`,
})

definePageMeta({
    title: 'Page',
    layout: 'front-office',
})


</script>