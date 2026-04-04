<template>
    <div v-if="medias.length" class="group relative w-full select-none overflow-hidden rounded-xl bg-dark/5"
        :class="aspectRatio ?? ''" tabindex="0" aria-label="Galerie d'images" @keydown="onKeydown"
        @mouseenter="isPaused = true" @mouseleave="isPaused = false" @touchstart.passive="onTouchStart"
        @touchend="onTouchEnd">
        <!-- Slides -->
        <template v-for="(media, i) in medias" :key="media.id">
            <NuxtImg v-if="media.file_name" :src="mediaUrl(media.file_name)" :alt="media.title || `Image ${i + 1}`"
                class="absolute inset-0 size-full object-cover transition-opacity duration-500"
                :class="i === current ? 'opacity-100 z-[1]' : 'opacity-0 z-0'" loading="lazy" format="webp" />
        </template>

        <!-- Arrows -->
        <template v-if="hasMultiple">
            <button aria-label="Image précédente"
                class="absolute left-2.5 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-black/5 bg-white/85 text-dark opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-white hover:shadow-md active:scale-95"
                @click.stop="prev">
                <Icon name="ic:round-arrow-back-ios-new" class="size-4" />
            </button>
            <button aria-label="Image suivante"
                class="absolute right-2.5 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-black/5 bg-white/85 text-dark opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-white hover:shadow-md active:scale-95"
                @click.stop="next">
                <Icon name="ic:round-arrow-forward-ios" class="size-4" />
            </button>
        </template>

        <!-- Dots -->
        <div v-if="hasMultiple" class="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
            <button v-for="(_, i) in medias" :key="i" :aria-label="`Image ${i + 1}`"
                class="h-2 cursor-pointer rounded-full transition-all duration-300" :class="i === current
                    ? 'w-5 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/80'" @click.stop="go(i)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MediaAttributes } from '@brz/shared'


const props = withDefaults(defineProps<{
    medias: MediaAttributes[]
    autoplay?: number
    aspectRatio?: string
}>(), {
    autoplay: 7000,
    aspectRatio: '',
})

const current = ref(0)
const isPaused = ref(false)
const touchStartX = ref(0)

const total = computed(() => props.medias.length)
const hasMultiple = computed(() => total.value > 1)

function go(index: number) {
    current.value = ((index % total.value) + total.value) % total.value
}

function next() {
    go(current.value + 1)
}

function prev() {
    go(current.value - 1)
}

function onTouchStart(e: TouchEvent) {
    touchStartX.value = e.touches[0].clientX
    isPaused.value = true
}

function onTouchEnd(e: TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchStartX.value
    if (delta < -50) next()
    else if (delta > 50) prev()
    isPaused.value = false
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') next()
    else if (e.key === 'ArrowLeft') prev()
}

let timer: ReturnType<typeof setInterval> | null = null

function startAutoplay() {
    if (timer) clearInterval(timer)
    if (props.autoplay > 0 && hasMultiple.value) {
        timer = setInterval(() => {
            if (!isPaused.value) next()
        }, props.autoplay)
    }
}

onMounted(() => { startAutoplay() })

onBeforeUnmount(() => { if (timer) clearInterval(timer) })

watch(() => props.autoplay, startAutoplay)
</script>