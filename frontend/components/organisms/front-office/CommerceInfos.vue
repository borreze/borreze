<template>
    <div v-if="post?.contact_name || post?.contact_email || post?.website || post?.website"
        class="rounded-lg bg-primary/5 px-5 py-4">
        <div class="text-sm text-gray-700 min-w-0">
            <div v-if="post.contact_name" class="font-semibold">Par {{ post.contact_name }}</div>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-gray-500 overflow-hidden">
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
                <a v-if="post.website" :href="post.website" target="_blank" rel="noopener noreferrer"
                    class="flex items-center gap-1 shrink-0 hover:text-primary transition">
                    <Icon name="ic:baseline-link" size="1em" />
                    {{ post.website }}
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