<template>
  <div v-if="dateTime" class="mt-1 flex items-center gap-3 text-sm text-gray-500">
    <span class="flex items-center gap-1">
      <Icon name="ic:outline-access-time" size="1em" />
      {{ datetimeGetTime(dateTime) }}
    </span>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  dateTime: Date | string | null | undefined
}>()

</script>