<template>
    <div v-if="post?.contact_name || post?.contact_email || post?.contact_phone"
        class="flex items-center gap-4 rounded-lg bg-gray-50 px-5 py-4">
        <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
            <Icon name="ic:outline-person" size="1.5em" />
        </div>
        <div class="text-sm text-gray-700 min-w-0">
            <div v-if="post.contact_name" class="font-semibold">{{ post.contact_name }}</div>
            <div class="mt-1 flex items-center gap-3 text-gray-500 flex-nowrap overflow-hidden">
                <a v-if="post.contact_email" :href="`mailto:${post.contact_email}`"
                    class="flex items-center gap-1 min-w-0 hover:text-primary transition">
                    <Icon name="ic:outline-email" size="1em" class="shrink-0" />
                    <span class="truncate">{{ post.contact_email }}</span>
                </a>
                <a v-if="post.contact_phone" :href="`tel:${post.contact_phone}`"
                    class="flex items-center gap-1 shrink-0 hover:text-primary transition">
                    <Icon name="ic:outline-phone" size="1em" />
                    {{ post.contact_phone }}
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PostAttributesFrontend } from '@brz/shared';

defineProps<{
    post?: PostAttributesFrontend | null
}>()
</script>