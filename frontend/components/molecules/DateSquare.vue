<template>
  <div v-if="dateTime"
    :class="['flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg', color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-700']">
    <span class="text-xl font-bold leading-none">
      {{ dateGetDay(dateTime) }}
    </span>
    <span class="text-[11px] font-semibold uppercase">
      {{ dateGetMonthShort(dateTime) }}
    </span>
  </div>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  dateTime: Date | string | null | undefined
  color?: 'primary' | 'gray'
}>(), {
  color: 'primary'
})

</script>