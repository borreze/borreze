<template>
    <div class="flex flex-col gap-1.5">
        <p v-if="missings" class="text-xs text-gray-500">
            Le mot de passe doit avoir: {{ missings }}
        </p>
        <div class="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${percentage}%`, backgroundColor: level.color }" />
        </div>
        <span class="text-xs font-medium transition-colors duration-300" :style="{ color: level.color }">
            {{ level.label }}
        </span>
    </div>
</template>

<script setup lang="ts">
import {  AUTH_PASSWORD_RULES_SCORE_MAX, passwordGetLevel, passwordGetMissing, passwordGetScore } from '@brz/shared';

const props = withDefaults(defineProps<{
    password?: string | null
}>(), {
    password: ''
})

const score = computed(() => passwordGetScore(props.password || ''))
const level = computed(() => passwordGetLevel(score.value))
const percentage = computed(() => Math.min(100, Math.round((score.value / AUTH_PASSWORD_RULES_SCORE_MAX) * 100)))
const missings = computed(() => passwordGetMissing(props.password || '').join(', '))

</script>