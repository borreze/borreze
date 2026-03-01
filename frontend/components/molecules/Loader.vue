<template>
  <div class="flex items-center justify-center h-[300px] sm:h-[350px] md:h-[400px]">
    <span class="loader"></span>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.loader {
  width: 84px;
  height: 84px;
  border: 5px solid var(--color-primary);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>