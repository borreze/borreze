<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="w-full max-w-md space-y-8 text-center">
      <div>
        <h1 class="text-9xl text-gray-300 century-gothic-bold">{{ error.statusCode }}</h1>
        <h2 class="text-3xl text-dark mt-8 century-gothic-bold">
          {{ title }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ description }}
        </p>
      </div>
      <div class="mt-10 space-y-4">
        <Button class="w-full" label="Retour à l'accueil" variant="primary" size="md" @click="goToHome()" />
        <Button class="w-full" label="Retour" variant="ghost" size="md" @click="goBack()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue'

const props = defineProps<{
  error: {
    statusCode: number;
    message: string;
  };
}>()

const isNuxtMessage = computed(() => {
  return props.error.message && (
    props.error.message.toLowerCase().includes('error') ||
    props.error.message.toLowerCase().includes('not') ||
    props.error.message.toLowerCase().includes('nuxt')
  );
});

const title = computed(() => {
  if (!isNuxtMessage.value) { // Si le message d'erreur ne semble pas être un message générique de Nuxt, on l'affiche tel quel
    return props.error.message;
  } else {
    switch (props.error.statusCode) {
      case 401:
        return "Non autorisé";
      case 403:
        return "Accès refusé";
      case 404:
        return "Élément non trouvé";
      case 500:
        return "Erreur interne du serveur";
      default:
        return "Erreur inconnue";
    }
  }
});

const description = computed(() => {
  switch (props.error.statusCode) {
    case 401:
      return 'Vous devez vous connecter pour accéder à cette ressource.';
    case 403:
      return 'Vous n\'avez pas l\'autorisation d\'accéder à cette page.';
    case 404:
      return 'L\'élément que vous recherchez n\'existe pas ou a été déplacée.';
    case 500:
      return 'Une erreur interne s\'est produite. Veuillez réessayer plus tard.';
    default:
      return 'Une erreur inconnue s\'est produite.';
  }
});

useHead({
  title: `${props.error.statusCode} - ${title.value}`,
});

</script>
