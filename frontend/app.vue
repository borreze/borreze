<template>
  <NuxtRouteAnnouncer />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Notivue v-slot="item">
    <Notification :item="item" :theme="pastelTheme" />
  </Notivue>
</template>

<script setup lang="ts">
import { Notivue, Notification, pastelTheme } from 'notivue'
import { useAuthStore } from '~/stores/auth'

// This ensures persistence across reloads
const auth = useAuthStore()
auth.loadFromCookies()
</script>