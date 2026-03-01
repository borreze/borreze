<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="w-full max-w-md space-y-8 text-center">
      <div>
        <h1 class="text-9xl font-bold text-gray-300">{{ error.statusCode }}</h1>
        <h2 class="mt-8 text-3xl font-extrabold text-gray-900">
          {{ title }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ description }}
        </p>
      </div>
      <div class="mt-10 space-y-4">
        <Button class="w-full" label="Retour à l'accueil" variant="primary" size="md" @click="goHome()" />
        <Button class="w-full" label="Retour" variant="ghost" size="md" @click="$router.go(-1)" />
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

const title = computed(() => {
  switch (props.error.statusCode) {
    case 401:
      return "Non autorisé";
    case 403:
      return "Accès refusé";
    case 404:
      return "Page non trouvée";
    case 500:
      return "Erreur interne du serveur";
    default:
      return "Erreur inconnue";
  }
});

const description = computed(() => {
  switch (props.error.statusCode) {
    case 401:
      return 'Vous devez vous connecter pour accéder à cette ressource.';
    case 403:
      return 'Vous n\'avez pas l\'autorisation d\'accéder à cette page.';
    case 404:
      return 'La page que vous recherchez n\'existe pas ou a été déplacée.';
    case 500:
      return 'Une erreur interne s\'est produite. Veuillez réessayer plus tard.';
    default:
      return 'Une erreur inconnue s\'est produite.';
  }
});

const goHome = () => {
  window.location.href = '/';
};

useHead({
  title: `${props.error.statusCode} - ${title.value}`,
});
</script>
