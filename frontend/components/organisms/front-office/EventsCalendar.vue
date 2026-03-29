<template>
    <Calendar @month-change="(y, m) => emit('month-change', y, m)">
        <template #cell="{ date }">
            <button v-for="event in getEventsForDate(date)" :key="event.id" type="button"
                class="w-full cursor-pointer rounded px-1 py-0.5 text-left text-[11px] leading-tight transition "
                :class="isInFuture(event.date_time) ? 'hover:bg-primary/10 text-primary' : 'text-gray-400'"
                @click="openPostModal(event)">
                {{ limitString(event.title, 20) }}
            </button>
        </template>
    </Calendar>

    <Modal v-model:open="modalOpen" :title="selectedEvent?.title" :onConfirm="() => openPostPage(selectedEvent!)"
        textConfirm="Voir l'événement" textCancel="Fermer">
        <div v-if="selectedEvent" class="space-y-4 max-w-md">
            <div v-if="selectedEvent.cover" class="aspect-video overflow-hidden rounded-lg bg-gray-200">
                <NuxtImg :src="mediaUrl(selectedEvent.cover.file_path)" :alt="selectedEvent.title"
                    class="h-full w-full object-cover" />
            </div>
            <EventDatetime v-if="selectedEvent.date_time" :dateTime="selectedEvent.date_time" />

            <div v-if="selectedEvent.categories?.length" class="flex flex-wrap gap-2">
                <Pill v-for="cat in selectedEvent.categories" :key="cat.id" :label="cat.name" size="sm"
                    variant="primary" />
            </div>

            <p v-if="selectedEvent.abstract" class="text-sm text-gray-600 italic">
                {{ selectedEvent.abstract }}
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
import EventDatetime from './EventDatetime.vue'

const props = defineProps<{
    posts: PostAttributesFrontend[]
}>()

const emit = defineEmits<{
    'month-change': [year: number, month: number]
}>()

const modalOpen = ref(false)
const selectedEvent = ref<PostAttributesFrontend | null>(null)

const getEventsForDate = (date: Date): PostAttributesFrontend[] =>
    props.posts.filter(p => p.date_time && dateIsSameDay(new Date(p.date_time), date))

const openPostModal = (event: PostAttributesFrontend) => {
    selectedEvent.value = event
    modalOpen.value = true
}

const openPostPage = (post: PostAttributesFrontend) => {
    modalOpen.value = false
    navigateTo(`/evenements/${post.slug}`)
}

</script>