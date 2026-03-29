<template>
    <div class="rounded-lg bg-white shadow-md overflow-hidden">
        <!-- Header mois -->
        <div class="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
            <Button variant="ghost" icon="ic:baseline-chevron-left" @click="prevMonth" />
            <h3 class="text-sm font-semibold text-dark capitalize"> {{ monthLabel }} </h3>
            <Button variant="ghost" icon="ic:baseline-chevron-right" @click="nextMonth" />
        </div>

        <!-- Jours de la semaine -->
        <div class="grid grid-cols-7 border-b border-gray-200">
            <div v-for="day in DAYS" :key="day" class="py-2 text-center text-xs font-medium text-gray-400">
                {{ day }}
            </div>
        </div>

        <!-- Grille jours -->
        <div class="grid grid-cols-7">
            <div v-for="(cell, i) in cells" :key="i" :class="[
                'min-h-16 sm:min-h-20 md:min-h-24 border-b border-r border-gray-100 p-1.5',
                cell.isCurrentMonth ? '' : 'bg-gray-50',
                cell.isToday ? 'bg-primary/5' : '',
            ]">
                <span :class="[
                    'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-gray-700',
                    cell.isCurrentMonth ? 'visible' : 'invisible',
                    cell.isToday ? 'bg-primary text-white font-bold' : '',
                ]">
                    {{ cell.day }}
                </span>

                <div :class="[
                    'mt-0.5 space-y-0.5',
                    cell.isCurrentMonth ? 'visible' : 'invisible',
                ]">
                    <slot name="cell" :date="cell.date" :is-current-month="cell.isCurrentMonth"
                        :is-today="cell.isToday" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from '../atoms/Button.vue';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const emit = defineEmits<{
    'month-change': [year: number, month: number]
}>()

interface CalendarCell {
    day: number
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
}

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())

const monthLabel = computed(() => {
    return new Date(currentYear.value, currentMonth.value)
        .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

const cells = computed<CalendarCell[]>(() => {
    const year = currentYear.value
    const month = currentMonth.value
    const today = new Date()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    let startOffset = firstDay.getDay() - 1
    if (startOffset < 0) startOffset = 6

    const totalCells = startOffset + lastDay.getDate()
    const rows = Math.ceil(totalCells / 7)
    const cellCount = rows * 7

    const result: CalendarCell[] = []

    for (let i = 0; i < cellCount; i++) {
        const date = new Date(year, month, 1 - startOffset + i)
        result.push({
            day: date.getDate(),
            date,
            isCurrentMonth: date.getMonth() === month,
            isToday: date.toDateString() === today.toDateString(),
        })
    }

    return result
})

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
    } else {
        currentMonth.value--
    }
    emit('month-change', currentYear.value, currentMonth.value + 1)
}

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
    } else {
        currentMonth.value++
    }
    emit('month-change', currentYear.value, currentMonth.value + 1)
}
</script>