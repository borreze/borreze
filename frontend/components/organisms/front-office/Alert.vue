<template>
    <Modal v-if="isReady" v-model:open="opened" :title="popup?.title || 'Information'" textConfirm="Fermer"
        textCancel="Ne plus afficher" :onConfirm="handleConfirm" :onCancel="handleCancel">
        <WysiwygRenderer v-if="popup.content" class="mt-6 prose max-w-none" :html="popup.content" />
    </Modal>
</template>

<script setup lang="ts">
import type { PopupAttributes } from '@brz/shared'
import Modal from '~/components/molecules/Modal.vue';
import WysiwygRenderer from '~/components/organisms/WysiwygRenderer.vue';

const popup = ref<PopupAttributes>({
    id: 1,
    title: 'Popupe météo',
    content: '<p>Des orages sont prévus cet après-midi. Restez à l\'abri et évitez les déplacements non essentiels.</p>',
    is_active: true
});

const STORAGE_KEY = 'brz-hidden-popups';

const getHiddenPopups = (): number[] => {
    if (import.meta.client) {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    return [];
};

const hidePopup = (id: number) => {
    const hidden = getHiddenPopups();
    if (!hidden.includes(id)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...hidden, id]));
    }
};

const isReady = ref(false);
const opened = ref(false);

onMounted(() => {
    const isHidden = getHiddenPopups().includes(popup.value.id);
    opened.value = !isHidden;
    isReady.value = true;
});

const handleConfirm = () => {
    // Just close the modal without hiding the popup
};

const handleCancel = () => {
    hidePopup(popup.value.id);
};
</script>