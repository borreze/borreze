<template>
  <nav aria-label="breadcrumb" class="my-4">
    <ol class="flex flex-wrap items-center list-none p-0 m-0 text-sm">
      <li v-for="(item, index) in breadcrumbs" :key="index" class="flex items-center">
        <Url v-if="index !== breadcrumbs.length - 1" :to="item.path" :label="item.name"
          :icon="item.path === '/' ? 'ic:baseline-home' : ''" />
        <span v-else class="font-base">
          {{ item.name }}
        </span>

        <span v-if="index < breadcrumbs.length - 1" class="mx-1 flex" aria-hidden="true">
          <Icon name="ic:baseline-chevron-right" size="1.25em" class="text-gray-500" />
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Url from '~/components/atoms/Url.vue';

const props = withDefaults(defineProps<{
  items: { name: string; path: string }[],
  home?: boolean
}>(), {
  items: () => [],
  home: true
})

const route = useRoute()

const breadcrumbs = computed(() => {
  const items = []

  if (props.home) {
    items.push({
      name: 'Accueil',
      path: '/'
    })
  }

  if (props.items.length > 0) {
    items.push(...props.items)
    return items
  }

  const pathSegments = route.path.split('/').filter(segment => segment !== '')
  let currentPath = ''

  pathSegments.forEach(segment => {
    currentPath += `/${segment}`

    const name = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())

    items.push({
      name,
      path: currentPath
    })
  })

  return items
})
</script>
