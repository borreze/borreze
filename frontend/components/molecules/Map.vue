<template>
    <div ref="mapContainer" class="z-10 min-h-[400px] h-full min-w-[250px] w-full" v-bind="$attrs" />
</template>

<script setup lang="ts">
import type { MapMarker } from '~/types/map'

const props = withDefaults(defineProps<{
    markers?: MapMarker[]
    center?: [number, number]
    zoom?: number
}>(), {
    markers: () => [],
    zoom: 13,
})

const mapContainer = ref<HTMLElement | null>(null)
let map: any

useHead({
    link: [{ rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=', crossorigin: '', }],
    script: [{ src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', integrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=', crossorigin: '', }]
})

const buildIcon = (marker: MapMarker): any => {
    const L = (window as any).L

    return L.icon({
        iconUrl: marker.popup?.icon ?? 'icons/position.webp',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -38],
    })
}

const initMap = () => {
    const L = (window as any).L
    if (!L || !mapContainer.value) return

    const defaultCenter: [number, number] = props.center
        ?? props.markers[0]?.position
        ?? [46.603354, 1.888334]

    map = L.map(mapContainer.value).setView(defaultCenter, props.zoom)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    for (const marker of props.markers) {
        const m = L.marker(marker.position, { icon: buildIcon(marker) }).addTo(map)

        if (marker.popup) {
            const { label, content } = marker.popup
            const html = [
                label ? `<h4 class="century-gothic-bold text-lg mb-1">${label}</h4>` : '',
                content ?? '',
            ].filter(Boolean).join('<br>')

            m.bindPopup(html, { maxWidth: 300 })
        }
    }
}

onMounted(() => {
    // Leaflet script may not be ready instantly — poll until available
    if ((window as any).L) {
        initMap()
    } else {
        const interval = setInterval(() => {
            if ((window as any).L) {
                clearInterval(interval)
                initMap()
            }
        }, 50)
    }
})

onBeforeUnmount(() => {
    map?.remove()
})
</script>