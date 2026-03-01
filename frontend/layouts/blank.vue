<template>
    <div>
        <Notivue v-slot="item">
            <Notification :item="item" />
        </Notivue>
        <div>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Notivue, Notification } from 'notivue'

</script>
