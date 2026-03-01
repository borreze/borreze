<template>
    <div>
        <Notivue v-slot="item">
            <Notification :item="item" />
        </Notivue>
        <div class="hidden lg:block">
            <EmergencyBar />
        </div>
        <Alert />
        <Header />
        <main>
            <slot />
        </main>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { Notivue, Notification } from 'notivue'
import Header from '~/components/organisms/site/Header.vue';
import Footer from '~/components/organisms/site/Footer.vue';
import EmergencyBar from '~/components/organisms/site/EmergencyBar.vue'
import Alert from '~/components/organisms/site/Alert.vue';

</script>
