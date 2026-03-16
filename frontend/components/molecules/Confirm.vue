<template>
    <Modal :open="state.open" :title="state.options.title ?? 'Confirmation'" :closable="true"
        :text-confirm="state.options.confirmLabel ?? 'Confirmer'" :text-cancel="state.options.cancelLabel ?? 'Annuler'"
        :on-confirm="_accept" :on-cancel="_cancel" @update:open="(v) => { if (!v) _cancel() }">
        <p class="text-sm text-gray-600">{{ state.options.message }}</p>
    </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/molecules/Modal.vue'

const { _state: state, _accept, _cancel } = useConfirm()
</script>