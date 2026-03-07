<template>
    <div class="safe-area">
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat tempore inventore itaque, cupiditate aspernatur voluptatum. Odit blanditiis beatae harum sunt ea quas placeat. Amet est dicta accusantium quaerat tempora perspiciatis.</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat tempore inventore itaque, cupiditate aspernatur voluptatum. Odit blanditiis beatae harum sunt ea quas placeat. Amet est dicta accusantium quaerat tempora perspiciatis.</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat tempore inventore itaque, cupiditate aspernatur voluptatum. Odit blanditiis beatae harum sunt ea quas placeat. Amet est dicta accusantium quaerat tempora perspiciatis.</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat tempore inventore itaque, cupiditate aspernatur voluptatum. Odit blanditiis beatae harum sunt ea quas placeat. Amet est dicta accusantium quaerat tempora perspiciatis.</div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
    requiresAuth: true,
    title: 'Administration',
    private: true,
})

</script>
