<template>
    <div class="w-full flex flex-col gap-1">
        <div v-if="label || hint" class="flex justify-start flex-wrap items-end gap-2">
            <label v-if="label" :for="id" class="text-sm font-medium text-dark">
                {{ label }}
                <span v-if="required" class="text-red-500">*</span>
            </label>
            <span v-if="hint" class="text-[11px] text-gray-400 pb-[1px]">
                {{ hint }}
            </span>
        </div>

        <div class="flex gap-3">
            <button v-if="totalPages > 1" type="button" :class="[buttonClass, buttonClassGrey, 'disabled:opacity-30']"
                :disabled="page === 0" @click="page--">
                <Icon name="ic:baseline-chevron-left" class="size-5" />
            </button>

            <div class="icon-grid">
                <button v-for="icon in visible" :key="icon" type="button" :class="[buttonClass, innerValue === icon
                    ? 'border-primary bg-primary/20 text-primary'
                    : buttonClassGrey]" @click="innerValue = icon">
                    <Icon :name="icon" class="size-6" />
                </button>
            </div>

            <button v-if="totalPages > 1" type="button" :class="[buttonClass, buttonClassGrey, 'disabled:opacity-30']"
                :disabled="page === totalPages - 1" @click="page++">
                <Icon name="ic:baseline-chevron-right" class="size-5" />
            </button>
        </div>
        <p v-if="error" class="text-sm text-red-500 mt-1">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue?: string | Date | null
    id?: string
    name?: string
    label?: string
    hint?: string
    class?: string
    required?: boolean
    error?: string | null
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void
}>()

const innerValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val as string | null)
})

const buttonClass = 'rounded-lg border p-2 transition-colors'
const buttonClassGrey = 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700'

const PER_PAGE = 15
const page = ref(0)

const totalPages = computed(() => Math.ceil(icons.length / PER_PAGE))
const visible = computed(() => icons.slice(page.value * PER_PAGE, (page.value + 1) * PER_PAGE))

const icons: string[] = [
    // Personnes & Auth
    'ic:baseline-person',
    'ic:baseline-people',
    'ic:baseline-manage-accounts',
    'ic:baseline-admin-panel-settings',
    'ic:baseline-lock',
    'ic:baseline-key',
    'ic:baseline-badge',
    'ic:baseline-groups',

    // Navigation & UI
    'ic:baseline-home',
    'ic:baseline-menu',
    'ic:baseline-dashboard',
    'ic:baseline-settings',
    'ic:baseline-tune',
    'ic:baseline-search',
    'ic:baseline-filter-list',
    'ic:baseline-more-vert',

    // Contenu & Média
    'ic:baseline-article',
    'ic:baseline-newspaper',
    'ic:baseline-description',
    'ic:baseline-feed',
    'ic:baseline-edit',
    'ic:baseline-create',
    'ic:baseline-post-add',
    'ic:baseline-format-list-bulleted',
    'ic:baseline-image',
    'ic:baseline-photo-library',
    'ic:baseline-video-library',
    'ic:baseline-mic',
    'ic:baseline-attach-file',
    'ic:baseline-folder',
    'ic:baseline-folder-open',

    // Communication
    'ic:baseline-email',
    'ic:baseline-mail',
    'ic:baseline-chat',
    'ic:baseline-forum',
    'ic:baseline-comment',
    'ic:baseline-announcement',
    'ic:baseline-notifications',
    'ic:baseline-campaign',
    'ic:baseline-send',
    'ic:baseline-contact-mail',
    'ic:baseline-phone',
    'ic:baseline-phone-in-talk',

    // Localisation & Carte
    'ic:baseline-location-on',
    'ic:baseline-map',
    'ic:baseline-place',
    'ic:baseline-near-me',
    'ic:baseline-directions',
    'ic:baseline-explore',

    // Temps & Agenda
    'ic:baseline-event',
    'ic:baseline-calendar-month',
    'ic:baseline-schedule',
    'ic:baseline-alarm',
    'ic:baseline-history',
    'ic:baseline-update',
    'ic:baseline-access-time',

    // Commerce & Finance
    'ic:baseline-euro',
    'ic:baseline-payments',
    'ic:baseline-receipt',
    'ic:baseline-shopping-cart',
    'ic:baseline-store',
    'ic:baseline-local-offer',
    'ic:baseline-bar-chart',
    'ic:baseline-pie-chart',
    'ic:baseline-trending-up',
    'ic:baseline-analytics',

    // Infrastructure & Technique
    'ic:baseline-construction',
    'ic:baseline-build',
    'ic:baseline-engineering',
    'ic:baseline-handyman',
    'ic:baseline-plumbing',
    'ic:baseline-electrical-services',
    'ic:baseline-water',
    'ic:baseline-recycling',
    'ic:baseline-local-gas-station',

    // Services publics & Collectivité
    'ic:baseline-school',
    'ic:baseline-local-library',
    'ic:baseline-museum',
    'ic:baseline-park',
    'ic:baseline-sports',
    'ic:baseline-local-hospital',
    'ic:baseline-local-police',
    'ic:baseline-fire-truck',
    'ic:baseline-directions-bus',
    'ic:baseline-emoji-transportation',
    'ic:baseline-account-balance',
    'ic:baseline-gavel',
    'ic:baseline-volunteer-activism',

    // Nature & Environnement
    'ic:baseline-eco',
    'ic:baseline-forest',
    'ic:baseline-wb-sunny',
    'ic:baseline-cloud',
    'ic:baseline-energy-savings-leaf',
    'ic:baseline-pets',

    // Statuts & Actions
    'ic:baseline-check-circle',
    'ic:baseline-cancel',
    'ic:baseline-warning',
    'ic:baseline-info',
    'ic:baseline-help',
    'ic:baseline-star',
    'ic:baseline-favorite',
    'ic:baseline-thumb-up',
    'ic:baseline-flag',
    'ic:baseline-visibility',
    'ic:baseline-download',
    'ic:baseline-share',
    'ic:baseline-print',
    'ic:baseline-qr-code',
]

</script>

<style scoped>
.icon-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.75rem;
}
</style>
