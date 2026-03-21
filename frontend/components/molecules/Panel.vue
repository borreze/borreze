<template>
    <Teleport to="body" :disabled="isStaticMode">
        <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="open && !isStaticMode" :class="['fixed inset-0 bg-black/70', zCLasses.backdrop]" @click="close" />
        </Transition>

        <Transition v-if="!isStaticMode" enter-active-class="transition-transform duration-300"
            :enter-from-class="enterFromClass" enter-to-class="translate-x-0"
            leave-active-class="transition-transform duration-300" leave-from-class="translate-x-0"
            :leave-to-class="leaveToClass">
            <aside v-if="open"
                :class="['fixed top-0 bottom-0  bg-white shadow-2xl z-50 flex flex-col overflow-y-auto', zCLasses.panel, sideClass]"
                :style="[`width: ${width}px`]">
                <div :class="['flex items-center p-4', side === 'left' ? 'justify-end' : 'justify-start']">
                    <Button icon="ic:baseline-close" variant="ghost" size="lg" @click="close" />
                </div>
                <slot />
            </aside>
        </Transition>

        <aside v-else class="relative bg-white border-gray-200 flex flex-col overflow-y-auto shrink-0"
            :class="side === 'left' ? 'border-r' : 'border-l'" :style="[`width: ${width}px`]">
            <slot />
        </aside>
    </Teleport>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue';

const props = withDefaults(defineProps<{
    open: boolean
    side?: 'left' | 'right'
    alwaysDisplay?: boolean
    width?: number
    level?: 1 | 2
}>(), {
    side: 'right',
    alwaysDisplay: false,
    width: 320,
    level: 1
})

const emit = defineEmits<{
    'update:open': [value: boolean]
}>()

const side = computed(() => props.side ?? 'right')

const isLg = ref(false)

onMounted(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    isLg.value = mq.matches
    mq.addEventListener('change', (e) => { isLg.value = e.matches })
})

const isStaticMode = computed(() => !!props.alwaysDisplay && isLg.value)

const sideClass = computed(() =>
    side.value === 'left' ? 'left-0' : 'right-0'
)

const enterFromClass = computed(() =>
    side.value === 'left' ? '-translate-x-full' : 'translate-x-full'
)

const leaveToClass = computed(() =>
    side.value === 'left' ? '-translate-x-full' : 'translate-x-full'
)

const close = () => {
    emit('update:open', false)
}

function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && props.open && !isStaticMode.value) {
        close()
    }
}

const zCLasses = computed(() => {
    if (props.level === 1) {
        return { backdrop: 'z-40', panel: 'z-50' }
    }
    if (props.level === 2) {
        return { backdrop: 'z-60', panel: 'z-70' }
    }

    return { backdrop: 'z-40', panel: 'z-50' }
})

watch(() => props.open, (isOpen) => {
    if (isStaticMode.value) return
    document.body.style.overflow = isOpen ? 'hidden' : ''
})

// Si on passe en mode statique pendant que le panel est ouvert, restaurer le scroll
watch(isStaticMode, (isStatic) => {
    if (isStatic) document.body.style.overflow = ''
})

onMounted(() => {
    window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKey)
    document.body.style.overflow = ''
})
</script>