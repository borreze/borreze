<template>
    <ClientOnly>
        <Map :markers="markers" class="rounded-xl" />
    </ClientOnly>
</template>

<script setup lang="ts">
import { buildUrl, type PostAttributesFrontend } from '@brz/shared';
import Map from '~/components/molecules/Map.vue';
import type { MapMarker, MapMarkerPopup } from '~/types/map';

const props = withDefaults(defineProps<{
    posts?: PostAttributesFrontend[]
    urlPattern?: string // as '/pages/<slug>'
}>(), {
    posts: () => [],
})

function buildPopup(post: PostAttributesFrontend): MapMarkerPopup {
    const address = post?.address ? `<address>${post.address}</address>` : ''
    const abstract = post?.abstract ? `<p class="italic text-gray-600">${post.abstract}</p>` : ''
    const link = props.urlPattern ? `<br><a href="${buildUrl(props.urlPattern, { id: post.id, slug: post.slug })}" class="!text-light !bg-primary !px-3 !py-1 !rounded-full !text-md !font-medium">Voir</a>` : ''

    return {
        label: post.title,
        content: `${address}${abstract}${link}`,
    }
}

function buildMarker(post: PostAttributesFrontend): MapMarker {
    return {
        position: [post.latitude!, post.longitude!],
        popup: buildPopup(post),
    }
}

const markers = computed<MapMarker[]>(() =>
    props.posts
        .filter(p => p.latitude != null && p.longitude != null)
        .map(p => buildMarker(p))
)
</script>