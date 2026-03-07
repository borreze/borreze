<template>
    <section class="rounded-xl custom-shadow p-4 ">
        <h2 class="title-submain">Bienvenue sur votre <span class="text-primary">Back-office </span> 👋</h2>
        <p class="mt-2 max-w-xl">Cet espace est dédié à la gestion de votre site internet. Ajoutez du contenu,
            modifiez vos pages
            existantes ou ajustez vos paramètres en quelques clics pour maintenir votre site à jour et
            refléter au mieux votre activité.
            <span class="font-medium"> Bonne utilisation ! </span>
        </p>
        <div class="mt-2 flex items-center gap-4 mt-4">
            <Button as="link" icon="ic:baseline-settings" label="Paramètres" href="/admin/settings" variant="outline"
                size="md" target="_blank" />
            <Button as="link" icon="ic:baseline-laptop-mac" label="Voir le site" href="/" variant="primary" size="md"
                target="_blank" />
        </div>
    </section>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue';

</script>