<template>
    <div>
        <div v-if="auth.isAuthenticated">
            <AuthBar />
        </div>
        <div>
            <EmergencyBar />
        </div>
        <Popup />
        <Header />
        <main>
            <slot />
        </main>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Header from '~/components/organisms/front-office/Header.vue';
import Footer from '~/components/organisms/front-office/Footer.vue';
import AuthBar from '~/components/organisms/front-office/AuthBar.vue'
import EmergencyBar from '~/components/organisms/front-office/EmergencyBar.vue'
import Popup from '~/components/organisms/front-office/Popup.vue';

import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

</script>

<style>
:root {
    --header-height: 72px !important;
}
</style>