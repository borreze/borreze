<template>
    <section class="rounded-xl shadow-[2px_2px_10px_2px_#0000001a] xl:shadow-none p-4 ">
        <h4 class="title-submain">Accès rapides</h4>
        <p class="mt-2 text-gray-600">Gérez rapidement les sections les plus importantes de votre site.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mt-4">
            <DashboradQuickCard v-if="permsContexts.includes('post')" to="/back-office/actualites" class="from-teal-600 to-teal-500"
                icon="ic:baseline-newspaper" text="Accéder aux" name="Actualités" />
            <DashboradQuickCard v-if="permsContexts.includes('media')" to="/back-office/medias" class="from-blue-600 to-blue-500" icon="ic:round-image"
                text="Voir tout" name="Les médias" />
            <DashboradQuickCard v-if="permsContexts.includes('page')" to="/back-office/pages" class="from-amber-600 to-amber-500"
                icon="ic:outline-sticky-note-2" text="Voir toutes" name="Les pages" />
            <DashboradQuickCard v-if="permsContexts.includes('school-meal')" to="/back-office/menus" class="from-violet-600 to-violet-500" icon="ic:round-menu-book"
                text="Éditer" name="Les Menus" />
        </div>
    </section>
</template>

<script setup lang="ts">
import DashboradQuickCard from './DashboradQuickCard.vue';
import { getPermsContexts } from '@brz/shared'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const permsContexts = computed(() => getPermsContexts(authStore.user))

</script>