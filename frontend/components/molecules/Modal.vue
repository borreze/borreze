<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="open" class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-xs"
        @click="handleBackdropClick" />
    </Transition>

    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-y-auto">
        <div class="bg-white text-black rounded-lg p-6 m-3 w-[450px] shadow pointer-events-auto">
          <div class="flex justify-between items-center mb-8">
            <h2 class="title-submain">
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
            <Button v-if="onCancel" variant="ghost" :label="textCancel" @click="handleCancel" />
            <Button v-if="onConfirm" variant="primary" :label="textConfirm" @click="handleConfirm" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  onConfirm?: () => void
  onCancel?: () => void
  closable?: boolean
  textConfirm?: string
  textCancel?: string
}>(), {
  title: 'Confirmation',
  closable: true,
  textConfirm: 'Confirmer',
  textCancel: 'Annuler'
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