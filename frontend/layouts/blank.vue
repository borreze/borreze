<template>
    <div>
        <Notivue v-slot="item">
            <Notification :item="item" />
        </Notivue>
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { Notivue, Notification } from 'notivue'

</script>

<style>
:root {
    --header-height: 0px !important;
}
</style>
