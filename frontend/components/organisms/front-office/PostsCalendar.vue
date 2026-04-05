<template>
    <Calendar @month-change="(y, m) => emit('month-change', y, m)">
        <template #cell="{ date }">
            <button v-for="post in getPostsForDate(date)" :key="post.id" type="button"
                class="w-full cursor-pointer rounded px-1 py-0.5 text-left text-[11px] leading-tight transition "
                :class="isInFuture(post.date_time) ? 'hover:bg-primary/10 text-primary' : 'text-gray-400'"
                @click="openPostModal(post)">
                {{ limitString(post.title, 20) }}
            </button>
        </template>
    </Calendar>

    <Modal v-model:open="modalOpen" :title="selectedPost?.title" :onConfirm="() => openPostPage(selectedPost!)"
        textConfirm="Voir l'événement" textCancel="Fermer">
        <div v-if="selectedPost" class="space-y-4 max-w-md">
            <div v-if="selectedPost.cover" class="aspect-video overflow-hidden rounded-lg bg-gray-200">
                <NuxtImg :src="mediaUrl(selectedPost.cover.file_name)" :alt="selectedPost.title"
                    class="h-full w-full object-cover" />
            </div>

            <EventInfosDate v-if="selectedPost && selectedPost.type === 'event'" :post="selectedPost" />
            <CommerceInfos v-if="selectedPost && selectedPost.type === 'commerce'" :post="selectedPost" />

            <div v-if="selectedPost.categories?.length" class="flex flex-wrap gap-2">
                <Pill v-for="cat in selectedPost.categories" :key="cat.id" :label="cat.name" size="sm"
                    variant="primary" />
            </div>

            <p v-if="selectedPost.abstract" class="text-sm text-gray-600 italic">
                {{ selectedPost.abstract }}
            </p>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import type { PostAttributesFrontend } from '@brz/shared'
import Calendar from '~/components/molecules/Calendar.vue'
import Modal from '~/components/molecules/Modal.vue'
import Pill from '~/components/atoms/Pill.vue'
import { mediaUrl } from '~/utils/media'
import { isInFuture } from '~/utils/date'
import EventInfosDate from './EventInfosDate.vue'
import CommerceInfos from './CommerceInfos.vue'

const props = defineProps<{
    posts: PostAttributesFrontend[]
}>()

const emit = defineEmits<{
    'month-change': [year: number, month: number]
}>()

const modalOpen = ref(false)
const selectedPost = ref<PostAttributesFrontend | null>(null)

const getPostsForDate = (date: Date): PostAttributesFrontend[] =>
    props.posts.filter(p => p.date_time && dateIsSameDay(new Date(p.date_time), date))

const openPostModal = (post: PostAttributesFrontend) => {
    selectedPost.value = post
    modalOpen.value = true
}

const openPostPage = (post: PostAttributesFrontend) => {
    modalOpen.value = false
    navigateTo(`/evenements/${post.slug}`)
}

</script>