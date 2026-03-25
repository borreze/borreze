<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="open"
        :class="['fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs', zClasses.backdrop]"
        @click="handleBackdropClick" />
    </Transition>

    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="open"
        :class="['fixed inset-0 flex items-center justify-center pointer-events-none overflow-y-auto', zClasses.modal]">
        <div class="bg-white text-black rounded-lg p-6 m-3 shadow pointer-events-auto" @click.stop>
          <div :class="['flex items-center mb-8', (closable && !title) ? 'justify-end' : 'justify-between']">
            <h2 v-if="title" class="title-submain">
              {{ title }}
            </h2>
            <button v-if="closable" @click="close"
              class="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
              <Icon name="ic:close" size="1.5em" />
            </button>
          </div>

          <div :class="[(onCancel || onConfirm) ? 'mb-8' : '']">
            <slot />
          </div>

          <div v-if="onCancel || onConfirm" class="flex justify-end space-x-2">
            <Button v-if="onCancel" variant="ghost" :label="textCancel" :icon="iconCancel" @click="handleCancel" />
            <Button v-if="onConfirm" variant="primary" :label="textConfirm" :icon="iconConfirm"
              @click="handleConfirm" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue'
import type { ComponentZIndexLevel } from '~/types/component';

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  onConfirm?: () => void
  onCancel?: () => void
  closable?: boolean
  textConfirm?: string
  textCancel?: string
  iconConfirm?: string
  iconCancel?: string
  zLevel?: ComponentZIndexLevel
  fullscreen?: boolean
}>(), {
  closable: true,
  textConfirm: 'Confirmer',
  textCancel: 'Annuler',
  zLevel: 1,
  fullscreen: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'close': []
}>()

const close = () => {
  emit('update:open', false)
  emit('close')
}

const handleConfirm = () => {
  props.onConfirm?.()
  close()
}

const handleCancel = () => {
  props.onCancel?.()
  close()
}

const handleBackdropClick = () => {
  if (props.closable) {
    close()
  }
}

const handleKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open && props.closable) {
    close()
  }
  if (e.key === 'Enter' && props.open && props.onConfirm) {
    handleConfirm()
  }
}

const zClasses = computed(() => {
  if (props.zLevel === 1) {
    return { backdrop: 'z-40', modal: 'z-50' }
  }
  if (props.zLevel === 2) {
    return { backdrop: 'z-60', modal: 'z-70' }
  }
  if (props.zLevel === 3) {
    return { backdrop: 'z-80', modal: 'z-90' }
  }

  return { backdrop: 'z-40', modal: 'z-50' }
})

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