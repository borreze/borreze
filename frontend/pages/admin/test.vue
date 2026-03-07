<template>
    <div class="safe-area">
        <WysiwygEditor v-model="content" />
        <hr>
        <WysiwygRenderer :html="content" :sanitize="true" />
        <hr>
        <div>{{ content }}</div>
    </div>
</template>

<script setup lang="ts">
import WysiwygEditor from '~/components/organisms/admin/WysiwygEditor.vue'
import WysiwygRenderer from '~/components/organisms/WysiwygRenderer.vue'

const content = ref('')

onMounted(() => {
    content.value = defaultContent
})

definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
    requiresAuth: true,
    title: 'Test WYSIWYG',
    private: true,
})

</script>