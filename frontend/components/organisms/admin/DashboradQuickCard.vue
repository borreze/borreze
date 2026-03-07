<template>
    <NuxtLink :to="props.to"
        :class="['group flex items-center justify-between gap-4 text-light rounded-xl bg-linear-to-r p-3 hover:pr-2 transition-all duration-200', props.class]">
        <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-12 h-12 bg-white/30 backdrop-blur-md rounded-lg">
                <Icon :name="props.icon" size="2em" />
            </div>
            <div class="flex flex-col">
                <span>
                    <span class="text-sm">{{ props.text }}</span><br>
                    <strong>{{ props.name }}</strong>
                </span>
            </div>
        </div>
        <Icon name="ic:round-arrow-forward" size="2em" />
    </NuxtLink>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
    to: string
    icon: string
    text: string
    name: string
    class: string
}>(), {
    text: 'Accéder à',
    name: '',
    class: 'from-green-700 to-green-600',
})

</script>