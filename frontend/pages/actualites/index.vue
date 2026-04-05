<template>
    <div class="safe-area-md">
        <h1 class="title-main pt-2 pb-4">Actualités</h1>
        <Breadcrumb :items="[{ name: 'Actualités', url: '/actualites' }]" />
        <div class="flex justify-between items-center mt-8 gap-4 flex-wrap">
            <CategorySelector :categories="categories" :selected="getCategories()" @remove="removeCategory"
                @add="addCategory" @reset="resetCategories" />
            <OrderBy :orders="[
                { label: 'Publiés récemment', value: 'published_at:DESC' },
                { label: 'Les plus anciens', value: 'published_at:ASC' },
                { label: 'Mise à jour récemment', value: 'updated_at:DESC' },
                { label: 'Ordre alphabétique', value: 'title:ASC' },
            ]" @select="setOrder" @reset="resetOrder" />
        </div>
        <Loader v-if="loading" />
        <div v-else-if="posts" class="mt-6">
            <Grid v-if="posts?.length > 0" :items="posts" :layouts="{ default: 1, sm: 2, md: 3, lg: 4 }">
                <template #item="{ item }">
                    <NewCard :post="item" />
                </template>
            </Grid>
            <NoContent v-else message="Aucune actualité pour le moment." />
        </div>
        <Paging :total="pagination?.total" :page="pagination?.page" @set-page="setPage" />
    </div>
</template>

<script setup lang="ts">
import Grid from '~/components/molecules/Grid.vue';
import NoContent from '~/components/molecules/NoContent.vue';
import NewCard from '~/components/organisms/front-office/NewCard.vue';
import CategorySelector from '~/components/organisms/front-office/CategorySelector.vue';
import OrderBy from '~/components/organisms/OrderBy.vue';
import Paging from '~/components/molecules/Paging.vue';
import Loader from '~/components/molecules/Loader.vue';
import Breadcrumb from '~/components/molecules/Breadcrumb.vue';
import { usePosts } from '~/composables/front-office/usePost';
import { useCategoriesByType } from '~/composables/front-office/useCategory';

const { posts, pagination, loading, setPage, removeCategory, addCategory, resetCategories, getCategories, setOrder, resetOrder } = await usePosts('new')
const { categories } = await useCategoriesByType('post', 'new')

useAppHead({
    title: 'Liste des actualités de la commune de Borrèze',
    description: 'Liste des actualités récentes de la commune de Borrèze, informations sur les événements, les projets et la vie locale.',
    url: `/actualites`,
})

definePageMeta({
    title: 'Actualités',
    layout: 'front-office',
})
</script>