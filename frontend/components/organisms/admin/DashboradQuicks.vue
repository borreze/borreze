<template>
    <section class="rounded-xl custom-shadow p-4 ">
        <h4 class="title-submain">Accès rapides</h4>
        <p class="mt-2 text-gray-600">Gérez rapidement les sections les plus importantes de votre site.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <DashboradQuickCard to="/admin/actualites" class="from-green-600 to-green-500" icon="ic:baseline-newspaper"
                text="Accéder aux" name="Actualités" />
            <DashboradQuickCard to="/admin/medias" class="from-teal-600 to-teal-500" icon="ic:round-image"
                text="Voir tout" name="Les médias" />
            <DashboradQuickCard to="/admin/pages" class="from-cyan-600 to-cyan-500" icon="ic:outline-sticky-note-2"
                text="Voir toutes" name="Les pages" />
            <DashboradQuickCard to="/admin/menus" class="from-sky-600 to-sky-500" icon="ic:round-menu-book"
                text="Éditer" name="Les Menus" />
        </div>
    </section>
</template>

<script setup lang="ts">
import DashboradQuickCard from './DashboradQuickCard.vue';

</script>