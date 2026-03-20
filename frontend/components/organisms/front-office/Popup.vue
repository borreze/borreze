<template>
    <Modal v-if="isReady" v-model:open="opened" :title="popup?.title || 'Information'" textConfirm="Fermer"
        textCancel="Ne plus afficher" :onConfirm="handleConfirm" :onCancel="handleCancel">
        <WysiwygRenderer v-if="popup?.content" class="mt-6 prose max-w-none" :html="popup.content" />
    </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/molecules/Modal.vue';
import WysiwygRenderer from '~/components/organisms/WysiwygRenderer.vue';
import { usePopups } from '~/composables/front-office/usePopup';

const { popup } = await usePopups()

const STORAGE_KEY = 'brz-hidden-popups';

const getHiddenPopups = (): number[] => {
    if (import.meta.client) {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    return [];
};

const setHiddenPopup = (hiddens: number[]) => {
    if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddens));
    }
};

const hidePopup = (id: number) => {
    const hidden = getHiddenPopups();
    if (!hidden.includes(id)) {
        hidden.push(id);
        setHiddenPopup(hidden);
    }
};

const isReady = ref(false);
const opened = ref(false);

onMounted(() => {
    const isHidden = !popup?.value || getHiddenPopups().includes(popup?.value.id);
    opened.value = !isHidden;
    isReady.value = true;
});

const handleConfirm = () => {
    // Just close the modal without hiding the popup
};

const handleCancel = () => {
    if (popup?.value) hidePopup(popup.value.id);
};
</script>