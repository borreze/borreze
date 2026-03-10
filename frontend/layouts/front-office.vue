<template>
    <div>
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
import Header from '~/components/organisms/front-office/Header.vue';
import Footer from '~/components/organisms/front-office/Footer.vue';
import EmergencyBar from '~/components/organisms/front-office/EmergencyBar.vue'
import Alert from '~/components/organisms/front-office/Alert.vue';

</script>
