<template>
    <div class="safe-area-md">
        <h1 class="title-main pt-2 pb-4">Recherche</h1>
        <Breadcrumb :items="[{ name: 'Recherche', path: '/recherche' }]" />
        <div class="flex justify-center mt-8">
            <div class="max-w-md w-full">
                <Field v-model="query" name="query" type="search" roundness="full" placeholder="Rechercher ..." />
            </div>
        </div>
        <Loader v-if="loading" />
        <div v-else-if="results" class="mt-6">
            <Grid v-if="results?.length > 0" :items="results">
                <template #item="{ item }">
                    <SearchCard :result="item" />
                </template>
            </Grid>
            <NoItem v-else-if="query" />
            <div v-else class="text-center">
                <p class="text-sm text-gray-400">
                    Entrez un terme de recherche pour trouver les informations qui vous intéressent.<br>
                    Il vous faut écrire au moins 3 caractères pour lancer la recherche.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Grid from '~/components/molecules/Grid.vue'
import NoItem from '~/components/molecules/NoItem.vue'
import Loader from '~/components/molecules/Loader.vue'
import Breadcrumb from '~/components/molecules/Breadcrumb.vue'
import Field from '~/components/atoms/Field.vue'
import { useSearch } from '~/composables/site/useSearch';
import SearchCard from '~/components/organisms/site/SearchCard.vue'

const route = useRoute()
const router = useRouter()
const initialQuery = (route.query.q as string) ?? ''

const { results, loading, setQuery } = await useSearch(initialQuery)

const query = ref(initialQuery)

watch(query, (val) => {
    setQuery(val)
    router.replace({ query: { q: val || undefined } })
})

function focusQueryInput() {
    setTimeout(() => {
        const input = document.querySelector('input[name="query"]') as HTMLInputElement | null
        if (input) input.focus()
    }, 200)
}

onMounted(() => {
    focusQueryInput()
})

useAppHead({
    title: 'Page de recherche de la commune de Borrèze',
    description: 'Page de recherche de la commune de Borrèze, trouvez les informations, les événements et les actualités qui vous intéressent.',
    url: `/recherche`,
})

definePageMeta({
    title: 'Recherche',
})

</script>