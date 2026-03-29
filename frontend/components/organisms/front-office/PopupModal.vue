<template>
    <Modal v-if="isReady" v-model:open="opened" :title="popup?.title || 'Information'" textConfirm="Fermer"
        textCancel="Ne plus afficher" :onConfirm="handleConfirm" :onCancel="handleCancel">
        <div class="flex flex-col max-w-lg overflow-y-auto">
            <p v-if="popup?.content" class="text-dark prose max-w-none">{{ popup.content }}</p>
            
            <div v-if="popup?.media" class="mt-4">
                <Url :to="mediaUrl(popup?.media.file_name)" icon="ic:baseline-download" label="Plus d'informations" />
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import type { PopupAttributesFrontend } from '@brz/shared';
import Url from '~/components/atoms/Url.vue';
import Modal from '~/components/molecules/Modal.vue';
import { usePopups } from '~/composables/front-office/usePopup';
import { mediaUrl } from '~/utils/media';

const { popups } = await usePopups()

const popup = ref<PopupAttributesFrontend | null>(null);
const opened = ref(false);
const isReady = ref(false);

onMounted(() => {
    popup.value = popups.value.find(p => !hasSeenPopup(p.id)) || null;
    opened.value = !!popup?.value
    isReady.value = true;
});

const handleConfirm = () => {
    // Just close the modal without hiding the popup
    opened.value = false;
};

const handleCancel = () => {
    if (popup?.value) addToSeenPopups(popup.value.id);
    opened.value = false;
};
</script>