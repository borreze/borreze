<template>
    <NuxtLink :to="result?._links.self_front">
        <article class="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-xl">
            <div class="p-6 flex flex-col gap-2">
                <span class="text-sm text-gray-500">
                    {{ result?._names.nice }}
                </span>
                <div class="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    <span class="text-xl font-semibold text-dark group-hover:text-primary transition line-clamp-1"
                        v-html="highlightedTitle" />
                    <Icon name="ic:baseline-arrow-forward" size="1.5em" class="mt-1" />
                </div>
            </div>
        </article>
    </NuxtLink>
</template>

<script setup lang="ts">
import { normalize, type SearchResult } from '@brz/shared'

const props = defineProps<{
    result: SearchResult
    query?: string
}>();

const highlightedTitle = computed(() => {
    if (!props.query?.trim() || !props.result.title) return props.result.title

    const escaped = normalize(props.query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'gi')

    const titleNormalized = normalize(props.result.title)
    const title = props.result.title

    let result = ''
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(titleNormalized)) !== null) {
        result += title.slice(lastIndex, match.index)
        result += `<mark class="bg-primary/20 rounded">${title.slice(match.index, match.index + match[0].length)}</mark>`
        lastIndex = match.index + match[0].length
    }

    result += title.slice(lastIndex)
    return result
})

</script>