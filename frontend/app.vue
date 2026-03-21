<template>
  <NuxtRouteAnnouncer />

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

// This ensures persistence across reloads
const authStore = useAuthStore()
authStore.loadFromCookies()
</script>