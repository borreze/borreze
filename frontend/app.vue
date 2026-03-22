<template>
  <NuxtRouteAnnouncer />

  <NuxtLoadingIndicator color="#DB1D12" />

  <!-- <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
    <div class="text-center">
      <Loader />
    </div>
  </div> -->

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Confirm />

  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
</template>

<script setup lang="ts">
import { Notivue, Notification } from 'notivue'
import { useAuthStore } from '~/stores/auth'
import Confirm from './components/molecules/Confirm.vue';
// import Loader from './components/molecules/Loader.vue';

// const { progress, isLoading } = useLoadingIndicator()

// This ensures persistence across reloads
const authStore = useAuthStore()
authStore.loadFromCookies()
</script>