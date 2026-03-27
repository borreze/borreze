# Snippets

Some of the most useful code snippets for common tasks.
Some might not be complete or up-to-date.

Feel free to contribute to this file to help others!

## Backend

Retrieve authenticated user's profile

```ts
public profile: RequestHandler = (req, res, next) => {
    if (!req.user) {
        next(new Unauthorized('Not authenticated'))
    return
  }
  res.status(200).json({ data: [req.user], message: 'Profile retrieved' })
}
```

A protected route example

```ts
import { authMiddleware } from '../middleware/auth.middleware'

router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json({ data: [req.user], message: 'Current user' })
})
```

Make logs

```ts
import { logService } from '../services/log.service'

router.get('/some-endpoint', (req, res) => {
    await logService.make('Someone just accessed /some-endpoint !', 'info', req) // Passed req to log IP and user info if available
    
    // ... 
})
```

## Frontend

### Components

WYSIWYG Editor

```vue
<template>
    <div class="safe-area">
        <WysiwygEditor v-model="content" />
        <hr>
        <WysiwygRenderer :html="content" :sanitize="true" />
        <hr>
        <div>{{ content }}</div>
    </div>
</template>

<script setup lang="ts">
import WysiwygEditor from '~/components/organisms/back-office/WysiwygEditor.vue'
import WysiwygRenderer from '~/components/organisms/WysiwygRenderer.vue'

const content = ref('')

onMounted(() => {
    content.value = defaultContent
})

</script>
```

Dropdown

```vue
<template>
    <section class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Formulaire - Sélection multiple</h2>
        <form @submit.prevent="handleMultipleSubmit" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tags *
                </label>
                <Dropdown v-model="multipleForm.tags"
                    :items="['Actualité', 'Important', 'Urgent', 'Info', 'Culture', 'Sport', 'Jeunesse']"
                    placeholder="Sélectionner des tags" multiple full-width />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Destinataires
                </label>
                <Dropdown v-model="multipleForm.recipients" :items="users" value-key="id" label-key="name"
                    placeholder="Sélectionner des utilisateurs" multiple full-width />
            </div>

            <button type="submit" class="px-6 py-2 bg-brz-red text-white rounded-md hover:bg-brz-red/90 transition">
                Envoyer
            </button>
        </form>

        <div v-if="multipleFormSubmitted" class="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <p class="text-sm text-green-800">
                Formulaire multiple soumis !
            </p>
            <pre class="mt-2 text-xs">{{ JSON.stringify(multipleForm, null, 2) }}</pre>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dropdown from '~/components/molecules/Dropdown.vue';

const users = [
    { id: 1, name: 'Marie Dupont', email: 'marie@example.com' },
    { id: 2, name: 'Jean Martin', email: 'jean@example.com' },
    { id: 3, name: 'Sophie Bernard', email: 'sophie@example.com' },
    { id: 4, name: 'Luc Moreau', email: 'luc@example.com' }
]

const selectedMultipleFruits = ref<string[]>([])

const removeFruit = (fruit: string) => {
    selectedMultipleFruits.value = selectedMultipleFruits.value.filter(f => f !== fruit)
}

const multipleForm = ref({
    tags: [] as string[],
    recipients: [] as typeof users[0][]
})
const multipleFormSubmitted = ref(false)

const handleMultipleSubmit = () => {
    console.log('Multiple form submitted:', multipleForm.value)
    multipleFormSubmitted.value = true
    setTimeout(() => {
        multipleFormSubmitted.value = false
    }, 3000)
}
</script>
```

Dropdown

```vue
<template>
    <section class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">15. Formulaire - Sélection multiple</h2>
        <form @submit.prevent="handleMultipleSubmit" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tags *
                </label>
                <Dropdown v-model="multipleForm.tags"
                    :items="['Actualité', 'Important', 'Urgent', 'Info', 'Culture', 'Sport', 'Jeunesse']"
                    placeholder="Sélectionner des tags" multiple full-width />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Destinataires
                </label>
                <Dropdown v-model="multipleForm.recipients" :items="users" value-key="id" label-key="name"
                    placeholder="Sélectionner des utilisateurs" multiple full-width />
            </div>

            <button type="submit" class="px-6 py-2 bg-brz-red text-white rounded-md hover:bg-brz-red/90 transition">
                Envoyer
            </button>
        </form>

        <div v-if="multipleFormSubmitted" class="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <p class="text-sm text-green-800">
                Formulaire multiple soumis !
            </p>
            <pre class="mt-2 text-xs">{{ JSON.stringify(multipleForm, null, 2) }}</pre>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dropdown from '~/components/molecules/Dropdown.vue';

const users = [
    { id: 1, name: 'Marie Dupont', email: 'marie@example.com' },
    { id: 2, name: 'Jean Martin', email: 'jean@example.com' },
    { id: 3, name: 'Sophie Bernard', email: 'sophie@example.com' },
    { id: 4, name: 'Luc Moreau', email: 'luc@example.com' }
]

const selectedMultipleFruits = ref<string[]>([])

const removeFruit = (fruit: string) => {
    selectedMultipleFruits.value = selectedMultipleFruits.value.filter(f => f !== fruit)
}

const multipleForm = ref({
    tags: [] as string[],
    recipients: [] as typeof users[0][]
})
const multipleFormSubmitted = ref(false)

const handleMultipleSubmit = () => {
    console.log('Multiple form submitted:', multipleForm.value)
    multipleFormSubmitted.value = true
    setTimeout(() => {
        multipleFormSubmitted.value = false
    }, 3000)
}
</script>
```

Dropdown

```vue
<template>
    <section class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">15. Formulaire - Sélection multiple</h2>
        <form @submit.prevent="handleMultipleSubmit" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tags *
                </label>
                <Dropdown v-model="multipleForm.tags"
                    :items="['Actualité', 'Important', 'Urgent', 'Info', 'Culture', 'Sport', 'Jeunesse']"
                    placeholder="Sélectionner des tags" multiple full-width />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Destinataires
                </label>
                <Dropdown v-model="multipleForm.recipients" :items="users" value-key="id" label-key="name"
                    placeholder="Sélectionner des utilisateurs" multiple full-width />
            </div>

            <button type="submit" class="px-6 py-2 bg-brz-red text-white rounded-md hover:bg-brz-red/90 transition">
                Envoyer
            </button>
        </form>

        <div v-if="multipleFormSubmitted" class="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <p class="text-sm text-green-800">
                Formulaire multiple soumis !
            </p>
            <pre class="mt-2 text-xs">{{ JSON.stringify(multipleForm, null, 2) }}</pre>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dropdown from '~/components/molecules/Dropdown.vue';

const users = [
    { id: 1, name: 'Marie Dupont', email: 'marie@example.com' },
    { id: 2, name: 'Jean Martin', email: 'jean@example.com' },
    { id: 3, name: 'Sophie Bernard', email: 'sophie@example.com' },
    { id: 4, name: 'Luc Moreau', email: 'luc@example.com' }
]

const selectedMultipleFruits = ref<string[]>([])

const removeFruit = (fruit: string) => {
    selectedMultipleFruits.value = selectedMultipleFruits.value.filter(f => f !== fruit)
}

const multipleForm = ref({
    tags: [] as string[],
    recipients: [] as typeof users[0][]
})
const multipleFormSubmitted = ref(false)

const handleMultipleSubmit = () => {
    console.log('Multiple form submitted:', multipleForm.value)
    multipleFormSubmitted.value = true
    setTimeout(() => {
        multipleFormSubmitted.value = false
    }, 3000)
}
</script>
```

Icons

```vue
<!-- From https://nuxt.com/modules/icon -->
<!-- You can use any icon from https://icones.js.org/ -->
<Icon name="uil:github" style="color: black" size="1em" />
```

Modal

```vue
<Modal title="Demo Modal" :onConfirm="() => console.log('Confirmed!')"
    :onCancel="() => console.log('Cancelled!')" textConfirm="Yes"
    textCancel="No">
    <p>This is a modal content example.</p>
</Modal>
```

### Send notification

```ts
import { push } from 'notivue'

push.info({
    title: 'Hello!',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
})
```

### SEO - Dynamic meta tags in a page component

```vue
<script setup lang="ts">
// Example of setting dynamic meta tags in a page component using useAppHead.ts
// ! useAppHead doesnt need to be imported, it's globally available
useAppHead({
  title: 'Borrèze',
  description: 'This the best shop in the world, you can find everything you need here!',
  image: '/images/shop-banner.jpg',
  localeAlternateUrls: {
    fr: '/fr/shop',
    en: '/en/shop',
  },
})
</script>
```

### API call with locale and auth token

```vue
<script setup lang="ts">
// ! useApi doesnt need to be imported, it's globally available
const apiClient = useApi()

apiClient.get('/posts').then((response) => {
    console.log('Posts fetched from API:', response.data)
}).catch((error) => {
    console.error('Error fetching posts:', error)
})
</script>
```
