<template>
    <Url :to="createSocialUrl(social.type, social.pseudo)" :icon="getSocialIcon(social.type)"
        :label="'@' + social?.pseudo" />
</template>

<script setup lang="ts">
import type { SocialAttributes } from '~/types/social';
import { createSocialUrl, getSocialIcon } from '~/utils/social';
import Url from '~/components/atoms/Url.vue';

const props = defineProps<{
    social: SocialAttributes
}>();

</script>