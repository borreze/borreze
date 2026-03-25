<template>
    <div class="safe-area-md">
        <h1 class="title-main pt-2 pb-4">Recherche</h1>
        <Breadcrumb :items="[{ name: 'Recherche', path: '/recherche' }]" />
        <div class="flex justify-center mt-8">
            <div class="max-w-xl w-full flex flex-col md:flex-row items-center gap-2">
                <Field v-model="query" name="query" type="search" roundness="full" placeholder="Rechercher ..." />
                <!-- <div class="flex justify-end w-full md:w-auto"> -->
                <Button :disabled="!isQueryValid(query)" icon="ic:search" label="Rechercher" variant="primary" size="md"
                    @click="execute" />
                <!-- </div> -->
            </div>
        </div>
        <Loader v-if="loading" />
        <div v-else-if="results" class="mt-6">
            <Grid v-if="results?.length > 0" :items="results">
                <template #item="{ item }">
                    <SearchCard :result="item" :query="query" />
                </template>
            </Grid>
            <NoContent v-else-if="query && isQueryValid(query)" />
            <div v-else class="text-center">
                <p class="text-sm text-gray-400">
                    Entrez un terme de recherche pour trouver les informations qui vous intéressent.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Grid from '~/components/molecules/Grid.vue'
import NoContent from '~/components/molecules/NoContent.vue'
import Loader from '~/components/molecules/Loader.vue'
import Breadcrumb from '~/components/molecules/Breadcrumb.vue'
import Field from '~/components/atoms/Field.vue'
import { useSearch } from '~/composables/front-office/useSearch';
import SearchCard from '~/components/organisms/front-office/SearchCard.vue'
import Button from '~/components/atoms/Button.vue'
import { isQueryValid } from '@brz/shared'

const route = useRoute()
const router = useRouter()
const initialQuery = (route.query.q as string) ?? ''

const { results, loading, setQuery, execute } = await useSearch(initialQuery)

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
    layout: 'front-office',
})

</script>