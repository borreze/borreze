<template>
    <div class="safe-area-md">
        <h1 class="title-main pt-2 pb-4">Événements</h1>
        <Breadcrumb :items="[{ name: 'Événements', url: '/evenements' }]" />
        <div class="flex justify-between items-center mt-8 gap-4 flex-wrap">
            <CategorySelector :categories="categories" :selected="getCategories()" @remove="removeCategory"
                @add="addCategory" @reset="resetCategories" />
        </div>
        <div class="mt-8 events-grid">
            <aside class="events-calendar">
                <div class="lg:sticky lg:top-5">
                    <EventsCalendar :posts="posts" @month-change="(year, month) => setRange(year, month)" />
                </div>
            </aside>

            <section class="events-list">
                <h4 class="title-submain">
                    Les événements du mois
                    <span class="text-dark">{{ detMonth(currentNiceMonth) }}</span>
                    <span :class="[isInFuture(dateLastDayOf(currentMonth, currentYear)) ? 'text-primary' : 'text-gray-400']">{{ currentNiceMonth }}</span>
                </h4>

                <Loader v-if="loading" />
                <Grid v-else-if="posts?.length > 0" :items="posts"
                    :layouts="getCategories().length ? { default: 1, sm: 2, md: 3 } : { default: 1, sm: 1, md: 2 }"
                    class="mt-6">
                    <template #item="{ item }">
                        <EventCard :post="item" />
                    </template>
                </Grid>
                <NoContent v-else icon="ic:baseline-calendar-month" message="Aucun événement ce mois-ci." />
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import Grid from '~/components/molecules/Grid.vue';
import NoContent from '~/components/molecules/NoContent.vue';
import EventCard from '~/components/organisms/front-office/EventCard.vue';
import CategorySelector from '~/components/organisms/front-office/CategorySelector.vue';
import Loader from '~/components/molecules/Loader.vue';
import Breadcrumb from '~/components/molecules/Breadcrumb.vue';
import { usePostsByDate } from '~/composables/front-office/usePost';
import { useCategoriesByType } from '~/composables/front-office/useCategory';
import EventsCalendar from '~/components/organisms/front-office/EventsCalendar.vue';

const { posts, loading, removeCategory, addCategory, resetCategories, getCategories, setFrom, setTo } = await usePostsByDate('event', {
    from: dateFirstDayOf(new Date().getMonth(), new Date().getFullYear()),
    to: dateLastDayOf(new Date().getMonth(), new Date().getFullYear()),
})
const { categories } = await useCategoriesByType('post')

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())

const currentNiceMonth = computed(() => niceMonth(currentMonth.value))

const niceMonth = (month: number | null | undefined): string => {
    if (!month || month < 1 || month > 12) return ''

    const date = new Date(2000, month - 1) // Year doesn't matter, we just want the month name
    const nice = date.toLocaleDateString('fr-FR', { month: 'long' })

    return nice
}

const detMonth = (niceMonth: string | null | undefined): string => {
    if (!niceMonth) return ''

    return ['a', 'e', 'i', 'o', 'u', 'y'].includes(niceMonth[0].toLowerCase()) ? "d'" : 'de ' // "d'" before vowel sounds, "de " otherwise
}

function setRange(year: number, month: number) {
    currentYear.value = year
    currentMonth.value = month

    const from = dateFirstDayOf(month, year)
    const to = dateLastDayOf(month, year)
    setFrom(from)
    setTo(to)
}

useAppHead({
    title: 'Liste des événements de la commune de Borrèze',
    description: 'Liste des événements récentes de la commune de Borrèze, informations sur les événements, les projets et la vie locale.',
    url: `/evenements`,
})

definePageMeta({
    title: 'Événements',
    layout: 'front-office',
})
</script>

<style scoped>
.events-grid {
    display: grid;
    gap: 2.5rem;
    grid-template-areas:
        "cal"
        "list";
}

.events-calendar {
    grid-area: cal;
}

.events-list {
    grid-area: list;
}

@media (min-width: 1024px) {
    .events-grid {
        grid-template-areas: "cal list";
        grid-template-columns: 420px 1fr;
        gap: 3rem;
    }
}

@media (min-width: 1280px) {
    .events-grid {
        grid-template-columns: 540px 1fr;
    }
}
</style>