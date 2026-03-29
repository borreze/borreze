<template>
    <div class="flex items-center justify-center h-[300px] sm:h-[350px] md:h-[400px]">
        <div class="text-center">
            <Icon :name="props.icon" size="3em" class="mx-auto text-gray-200" />
            <p class="text-sm text-gray-300">{{ props.message }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
    icon?: string
    message?: string
}>(), {
    icon: 'ic:round-sentiment-dissatisfied',
    message: 'Aucun élément trouvé.'
});

</script>