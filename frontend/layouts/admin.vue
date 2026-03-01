<template>
    <div>
        <Notivue v-slot="item">
            <Notification :item="item" />
        </Notivue>
        <Header />
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { Notivue, Notification } from 'notivue'
import Header from '~/components/organisms/admin/Header.vue';

</script>
