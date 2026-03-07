<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="open" class="fixed inset-0 bg-black/70 z-40" @click="close" />
        </Transition>

        <Transition enter-active-class="transition-transform duration-300" :enter-from-class="enterFromClass"
            enter-to-class="translate-x-0" leave-active-class="transition-transform duration-300"
            leave-from-class="translate-x-0" :leave-to-class="leaveToClass">
            <aside v-if="open"
                :class="['fixed top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col overflow-y-auto', sideClass]">
                <div :class="['flex items-center p-4', side === 'left' ? 'justify-end' : 'justify-start']">
                    <Button icon="ic:baseline-close" variant="ghost" size="lg" @click="close" />
                </div>

                <slot />
            </aside>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue';

const props = defineProps<{
    open: boolean
    side?: 'left' | 'right'
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
}>()

const side = computed(() => props.side ?? 'right')

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
    if (e.key === 'Escape' && props.open) {
        close()
    }
}

watch(() => props.open, (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

onMounted(() => {
    window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKey)
    document.body.style.overflow = ''
})
</script>