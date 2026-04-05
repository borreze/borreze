<template>
    <div class="safe-area-md">
        <h1 class="title-main pt-2 pb-4">Commerces</h1>
        <Breadcrumb :items="[{ name: 'Commerces', url: '/commerces' }]" />
        <div class="flex justify-between items-center mt-8 gap-4 flex-wrap">
            <CategorySelector :categories="categories" :selected="getCategories()" @remove="removeCategory"
                @add="addCategory" @reset="resetCategories" />
        </div>
        <div class="mt-8 commerces-grid">
            <aside class="commerces-map">
                <div class="lg:sticky lg:top-5">
                    <PostsMap :posts="posts" :url-pattern="'/commerces/<slug>'" />
                </div>
            </aside>

            <section class="commerces-list">
                <Loader v-if="loading" />
                <Grid v-else-if="posts?.length > 0" :items="posts"
                    :layouts="{ default: 1, sm: 2, lg: 1, xl: 2, '3xl': 3 }">
                    <template #item="{ item }">
                        <CommerceCard :post="item" />
                    </template>
                </Grid>
                <NoContent v-else message="Aucun commerce trouvé." />
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import Grid from '~/components/molecules/Grid.vue';
import NoContent from '~/components/molecules/NoContent.vue';
import CommerceCard from '~/components/organisms/front-office/CommerceCard.vue';
import CategorySelector from '~/components/organisms/front-office/CategorySelector.vue';
import Loader from '~/components/molecules/Loader.vue';
import Breadcrumb from '~/components/molecules/Breadcrumb.vue';
import { usePosts } from '~/composables/front-office/usePost';
import { useCategoriesByType } from '~/composables/front-office/useCategory';
import PostsMap from '~/components/organisms/front-office/PostsMap.vue';

const { posts, loading, removeCategory, addCategory, resetCategories, getCategories } = await usePosts('commerce', { page: 1, limit: 99 }) // assume that there is not more than 99 commerces
const { categories } = await useCategoriesByType('post')

useAppHead({
    title: 'Liste des commerces de la commune de Borrèze',
    description: 'Liste des commerces de la commune de Borrèze, informations sur les commerces.',
    url: `/commerces`,
})

definePageMeta({
    title: 'Commerces',
    layout: 'front-office',
})
</script>

<style scoped>
.commerces-grid {
    display: grid;
    gap: 2.5rem;
    grid-template-areas:
        "map"
        "list";
}

.commerces-map {
    grid-area: map;
}

.commerces-list {
    grid-area: list;
}

@media (min-width: 64rem) {
    .commerces-grid {
        grid-template-areas: "map list";
        grid-template-columns: 420px 1fr;
        gap: 3rem;
    }
}

@media (min-width: 80rem) {
    .commerces-grid {
        grid-template-columns: 540px 1fr;
    }
}
</style>