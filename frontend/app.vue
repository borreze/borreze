<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// This ensures persistence across reloads
const auth = useAuthStore()
auth.loadFromCookies()

</script>