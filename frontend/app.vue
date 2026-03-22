<template>
  <NuxtRouteAnnouncer />

  <NuxtLoadingIndicator v-if="isInBO()" color="#DB1D12" />
  <div v-else-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
    <div class="text-center">
      <Loader />
    </div>
  </div>

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
import Loader from './components/molecules/Loader.vue';
import { isInBO } from '~/utils/routing'

const { progress, isLoading } = useLoadingIndicator()

// Load menus immediately to ensure they're available in the header and other components without delay
const menuStore = useMenuStore()
menuStore.restoreMenus('front-office')
menuStore.restoreMenus('back-office')

// This ensures persistence across reloads
const authStore = useAuthStore()
authStore.loadFromCookies()
</script>