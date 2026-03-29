<template>
    <div class="flex flex-col gap-3 fixed bottom-18 left-4 translate-y-1/2 z-30">
        <a v-for="phone in phones" :key="phone.number" :href="`tel:${phone.number}`" rel="noopener noreferrer"
            class="group flex items-center justify-start">
            <div class="w-12 h-12 rounded-full bg-dark 
            flex items-center justify-center cursor-pointer shadow-lg
            group-hover:rounded-r-none group-hover:bg-primary transition-all delay-100">
                <Icon :name="phone.icon" size="1.5rem" class="text-white text-xl" />
            </div>
            <div class="px-4 py-3 rounded-r-full bg-primary  
            opacity-0 -translate-x-10 
            group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400">
                <span class="text-light text-sm">{{ phone.name }}</span>
            </div>
        </a>
    </div>
</template>

<script setup lang="ts">
const phones = [
    {
        name: '05 53 28 83 38',
        number: '0553288338',
        icon: 'mdi:phone',
    },
    {
        name: '112',
        number: '112',
        icon: 'streamline-flex:sos-help-emergency-sign',
    },
]
</script>