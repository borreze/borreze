<template>
    <div ref="editorRef" id="wysiwyg-editor" class="wysiwyg-editor z-0">
        <div v-if="editor" :class="['wysiwyg-toolbar']" :style="{ opacity: editorToolbarVisible ? 1 : 0 }">
            <!-- Undo et Redo -->
            <div class="wysiwyg-toolbar__group">
                <Button variant="ghost" :disabled="!editor.can().undo()" title="Annuler (Ctrl+Z)" roundness="sm"
                    size="sm" icon="ic:baseline-undo" @click="editor.chain().focus().undo().run()" />
                <Button variant="ghost" :disabled="!editor.can().redo()" title="Rétablir (Ctrl+Y)" roundness="sm"
                    size="sm" icon="ic:baseline-redo" @click="editor.chain().focus().redo().run()" />
            </div>

            <!-- Formatting -->
            <div v-if="anyFeature('bold', 'italic', 'underline', 'strike')" class="wysiwyg-toolbar__group">
                <Button v-if="hasFeature('bold')" :variant="editor.isActive('bold') ? 'primary' : 'ghost'"
                    title="Gras (Ctrl+B)" roundness="sm" size="sm" icon="ic:baseline-format-bold"
                    @click="editor.chain().focus().toggleBold().run()" />
                <Button v-if="hasFeature('italic')" :variant="editor.isActive('italic') ? 'primary' : 'ghost'"
                    title="Italique (Ctrl+I)" roundness="sm" size="sm" icon="ic:baseline-format-italic"
                    @click="editor.chain().focus().toggleItalic().run()" />
                <Button v-if="hasFeature('underline')" :variant="editor.isActive('underline') ? 'primary' : 'ghost'"
                    title="Souligné (Ctrl+U)" roundness="sm" size="sm" icon="ic:baseline-format-underlined"
                    @click="editor.chain().focus().toggleUnderline().run()" />
                <Button v-if="hasFeature('strike')" :variant="editor.isActive('strike') ? 'primary' : 'ghost'"
                    title="Barré" roundness="sm" size="sm" icon="ic:baseline-format-strikethrough"
                    @click="editor.chain().focus().toggleStrike().run()" />
            </div>

            <!-- Formatting -->
            <div v-if="anyFeature('bold', 'italic', 'underline', 'strike')" class="wysiwyg-toolbar__group">
                <Button v-if="hasFeature('bold')" :variant="editor.isActive('bold') ? 'primary' : 'ghost'"
                    title="Gras (Ctrl+B)" roundness="sm" size="sm" icon="ic:baseline-format-bold"
                    @click="editor.chain().focus().toggleBold().run()" />
                <Button v-if="hasFeature('italic')" :variant="editor.isActive('italic') ? 'primary' : 'ghost'"
                    title="Italique (Ctrl+I)" roundness="sm" size="sm" icon="ic:baseline-format-italic"
                    @click="editor.chain().focus().toggleItalic().run()" />
                <Button v-if="hasFeature('underline')" :variant="editor.isActive('underline') ? 'primary' : 'ghost'"
                    title="Souligné (Ctrl+U)" roundness="sm" size="sm" icon="ic:baseline-format-underlined"
                    @click="editor.chain().focus().toggleUnderline().run()" />
                <Button v-if="hasFeature('strike')" :variant="editor.isActive('strike') ? 'primary' : 'ghost'"
                    title="Barré" roundness="sm" size="sm" icon="ic:baseline-format-strikethrough"
                    @click="editor.chain().focus().toggleStrike().run()" />
            </div>

            <!-- Headings -->
            <div v-if="hasFeature('heading')" class="wysiwyg-toolbar__group">
                <Button v-for="lvl in headingLevels" :key="lvl"
                    :variant="editor.isActive('heading', { level: lvl }) ? 'primary' : 'ghost'" :label="`H${lvl}`"
                    roundness="sm" size="sm" class="font-mono font-bold" title="Titre"
                    @click="editor.chain().focus().toggleHeading({ level: lvl as HeadingLevel }).run()" />
            </div>

            <!-- Alignment -->
            <div v-if="hasFeature('textAlign')" class="wysiwyg-toolbar__group">
                <Button :variant="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'ghost'" title="Aligner à gauche"
                    icon="ic:baseline-format-align-left" roundness="sm" size="sm"
                    @click="editor.chain().focus().setTextAlign('left').run()" />
                <Button :variant="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'ghost'" title="Centrer"
                    icon="ic:baseline-format-align-center" roundness="sm" size="sm"
                    @click="editor.chain().focus().setTextAlign('center').run()" />
                <Button :variant="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'ghost'"
                    icon="ic:baseline-format-align-right" title="Aligner à droite" roundness="sm" size="sm"
                    @click="editor.chain().focus().setTextAlign('right').run()" />
                <Button :variant="editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'ghost'" title="Justifier"
                    icon="ic:baseline-format-align-justify" roundness="sm" size="sm"
                    @click="editor.chain().focus().setTextAlign('justify').run()" />
            </div>

            <!-- Lists -->
            <div v-if="anyFeature('bulletList', 'orderedList')" class="wysiwyg-toolbar__group">
                <Button v-if="hasFeature('bulletList')" :variant="editor.isActive('bulletList') ? 'primary' : 'ghost'"
                    title="Liste à puces" roundness="sm" size="sm" icon="ic:baseline-format-list-bulleted"
                    @click="editor.chain().focus().toggleBulletList().run()" />
                <Button v-if="hasFeature('orderedList')" :variant="editor.isActive('orderedList') ? 'primary' : 'ghost'"
                    title="Liste numérotée" roundness="sm" size="sm" icon="ic:baseline-format-list-numbered"
                    @click="editor.chain().focus().toggleOrderedList().run()" />
            </div>

            <!-- Block -->
            <div v-if="anyFeature('blockquote', 'codeBlock', 'horizontalRule')" class="wysiwyg-toolbar__group">
                <Button v-if="hasFeature('blockquote')" :variant="editor.isActive('blockquote') ? 'primary' : 'ghost'"
                    title="Citation" roundness="sm" size="sm" icon="ic:baseline-format-quote"
                    @click="editor.chain().focus().toggleBlockquote().run()" />
                <Button v-if="hasFeature('codeBlock')" :variant="editor.isActive('codeBlock') ? 'primary' : 'ghost'"
                    title="Bloc de code" roundness="sm" size="sm" icon="ic:baseline-code"
                    @click="editor.chain().focus().toggleCodeBlock().run()" />
                <Button v-if="hasFeature('horizontalRule')" variant="ghost" title="Ligne horizontale" roundness="sm"
                    size="sm" icon="ic:baseline-horizontal-rule"
                    @click="editor.chain().focus().setHorizontalRule().run()" />
            </div>

            <!-- Link -->
            <div v-if="hasFeature('link')" class="wysiwyg-toolbar__group">
                <Button :variant="editor.isActive('link') ? 'primary' : 'ghost'" title="Lien" roundness="sm" size="sm"
                    icon="ic:baseline-link" @click="openLinkModal" />
                <Button v-if="editor.isActive('link')" variant="ghost" roundness="sm" size="sm"
                    icon="ic:baseline-link-off" title="Supprimer le lien"
                    @click="editor.chain().focus().unsetLink().run()" />
            </div>

            <!-- Image -->
            <div v-if="hasFeature('image')" class="wysiwyg-toolbar__group">
                <Button variant="ghost" roundness="sm" size="sm" icon="ic:baseline-image" title="Insérer une image"
                    @click="openImageModal" />
            </div>

            <!-- Table -->
            <div v-if="hasFeature('table')" class="wysiwyg-toolbar__group">
                <Button title="Insérer un tableau" roundness="sm" size="sm" variant="ghost"
                    icon="fluent:table-add-20-filled"
                    @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()" />

                <template v-if="editor.isActive('table')">
                    <Button title="Ajouter colonne après" roundness="sm" size="sm" variant="ghost"
                        icon="fluent:table-insert-column-20-filled"
                        @click="editor.chain().focus().addColumnAfter().run()" />
                    <Button title="Supprimer colonne" roundness="sm" size="sm" variant="ghost"
                        icon="fluent:table-delete-column-20-filled"
                        @click="editor.chain().focus().deleteColumn().run()" />
                    <Button title="Ajouter ligne après" roundness="sm" size="sm" variant="ghost"
                        icon="fluent:table-insert-row-20-filled" @click="editor.chain().focus().addRowAfter().run()" />
                    <Button title="Supprimer ligne" roundness="sm" size="sm" variant="ghost"
                        icon="fluent:table-delete-row-20-filled" @click="editor.chain().focus().deleteRow().run()" />
                    <Button title="Supprimer le tableau" roundness="sm" size="sm" variant="danger"
                        icon="fluent:table-dismiss-24-filled" @click="editor.chain().focus().deleteTable().run()" />
                </template>
            </div>

            <!-- Button -->
            <div v-if="hasFeature('button')" class="wysiwyg-toolbar__group">
                <Button title="Bouton" roundness="sm" size="sm" variant="ghost" icon="fluent:button-20-filled"
                    @click="openButtonModal" />
            </div>
        </div>

        <!-- editor -->
        <editor-content class="wysiwyg-content wy-prose" :editor="editor" />

        <!-- Link modal -->
        <Modal v-model:open="showLinkModal" title="Insérer un lien" textConfirm="Ajouter" textCancel="Annuler"
            :onConfirm="setLink" :onCancel="closeLinkModal">
            <div class="flex flex-col gap-4">
                <Field v-model="linkUrl" roundness="md" type="url" label="URL du lien"
                    placeholder="https://exemple.com" />
                <Field v-model="linkLabel" roundness="md" label="Texte du lien"
                    placeholder="Texte du lien (optionnel)" />
            </div>
        </Modal>

        <!-- Image modal -->
        <Modal v-model:open="showImageModal" title="Insérer une image" textConfirm="Ajouter" textCancel="Annuler"
            :onConfirm="insertImage" :onCancel="closeImageModal">
            <div class="flex flex-col gap-4">
                <Field v-model="imageUrl" roundness="md" type="url" label="URL de l'image"
                    placeholder="https://exemple.com/image.jpg" />
                <Field v-model="imageAlt" roundness="md" label="Texte alternatif"
                    placeholder="Texte alternatif de l'image" />
                <Field v-model="imageWidth" roundness="md" label="Largeur"
                    placeholder="Largeur de l'image (ex: 400px)" />
            </div>
        </Modal>

        <!-- Button modal -->
        <Modal v-model:open="showButtonModal" title="Insérer un bouton" textConfirm="Ajouter" textCancel="Annuler"
            :onConfirm="insertButton" :onCancel="closeButtonModal">
            <div class="flex flex-col gap-4">
                <Field v-model="btnLabel" roundness="md" label="Texte du bouton" placeholder="Cliquez moi" />
                <Field v-model="btnHref" roundness="md" label="Lien" placeholder="https://exemple.com" />
                <Dropdown v-model="btnVariant" label="Style" :items="buttonVariantOptions" valueKey="key" full-width
                    variant="light" />
            </div>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import '~/assets/css/wysiwyg-prose.css'
import { ref, watch, onBeforeUnmount, defineComponent, h } from 'vue'
import { useEditor, EditorContent, VueNodeViewRenderer, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Image as TiptapImage } from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { Node, mergeAttributes } from '@tiptap/core'
import Modal from '~/components/molecules/Modal.vue'
import Field from '~/components/atoms/Field.vue'
import Dropdown from '~/components/molecules/Dropdown.vue'
import Button from '~/components/atoms/Button.vue'

type Feature =
    | 'bold' | 'italic' | 'underline' | 'strike'
    | 'heading' | 'textAlign'
    | 'bulletList' | 'orderedList'
    | 'blockquote' | 'codeBlock' | 'horizontalRule'
    | 'link' | 'image' | 'table' | 'button'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
const headingLevels: HeadingLevel[] = [1, 2, 3, 4, 5, 6]

const props = withDefaults(defineProps<{
    modelValue?: string | null
    features?: Feature[]
    editable?: boolean
}>(), {
    modelValue: '',
    features: () => [
        'bold', 'italic', 'underline', 'strike',
        'heading', 'textAlign',
        'bulletList', 'orderedList',
        'blockquote', 'horizontalRule',
        'link', 'image', 'table', 'button',
    ],
    editable: true,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'change': [value: string]
}>()

const editorRef = ref<HTMLElement | null>(null)
const editorToolbarVisible = ref(true)

onMounted(() => {
    const observer = new IntersectionObserver(
        ([entry]) => { editorToolbarVisible.value = entry.isIntersecting },
        { threshold: 0, rootMargin: '-200px' } // le toolbar disparaît dès que le haut de l'éditeur est à moins de 100px du viewport. Permet de faire disparaître le toolbar avant qu'il ne touche le haut de l'écran, pour éviter de le cacher quand on scroll vers le bas
    )
    if (editorRef.value) observer.observe(editorRef.value)
    onBeforeUnmount(() => observer.disconnect())
})

// -----------------------------------------------------------------------------
// Feature helpers
// -----------------------------------------------------------------------------

function hasFeature(f: Feature) { return props.features.includes(f) }
function anyFeature(...fs: Feature[]) { return fs.some(f => props.features.includes(f)) }

// -----------------------------------------------------------------------------
// Resizable Image NodeView
// -----------------------------------------------------------------------------

const ResizableImageView = defineComponent({
    props: nodeViewProps,
    setup(props) {
        const imgRef = ref<HTMLImageElement | null>(null)
        const isResizing = ref(false)
        const startX = ref(0)
        const startW = ref(0)

        const getWidth = () => props.node.attrs.width || 'auto'

        function onHandleMousedown(e: MouseEvent) {
            e.preventDefault()
            isResizing.value = true
            startX.value = e.clientX
            startW.value = imgRef.value?.offsetWidth ?? 300

            const onMove = (ev: MouseEvent) => {
                if (!isResizing.value) return
                const newW = Math.max(60, startW.value + ev.clientX - startX.value)
                props.updateAttributes({ width: newW + 'px' })
            }
            const onUp = () => {
                isResizing.value = false
                window.removeEventListener('mousemove', onMove)
                window.removeEventListener('mouseup', onUp)
            }
            window.addEventListener('mousemove', onMove)
            window.addEventListener('mouseup', onUp)
        }

        return () => h(NodeViewWrapper, { class: 'wy-image-wrapper' }, () =>
            h('div', {
                class: 'wy-image-inner',
                style: { width: getWidth() !== 'auto' ? getWidth() : undefined },
            }, [
                h('img', {
                    ref: imgRef,
                    src: props.node.attrs.src,
                    alt: props.node.attrs.alt ?? '',
                }),
                h('div', { class: 'wy-image-handle', onMousedown: onHandleMousedown }),
            ])
        )
    },
})

const ResizableImage = TiptapImage.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                renderHTML: (attrs) => attrs.width ? { style: `width:${attrs.width};max-width:100%` } : {},
            },
        }
    },
    addNodeView() {
        return VueNodeViewRenderer(ResizableImageView)
    },
})

// -----------------------------------------------------------------------------
// Button Node (custom inline atom)
// -----------------------------------------------------------------------------

const ButtonNode = Node.create({
    name: 'customButton',
    group: 'inline',
    inline: true,
    atom: true,
    addAttributes() {
        return {
            label: { default: 'Cliquez ici' },
            href: { default: '#' },
            variant: { default: 'primary' },
        }
    },
    parseHTML() {
        return [{ tag: 'a[data-wybutton]' }]
    },
    renderHTML({ HTMLAttributes }) {
        return ['a', mergeAttributes(HTMLAttributes, {
            'data-wybutton': '',
            class: `wy-btn wy-btn--${HTMLAttributes.variant}`,
            href: HTMLAttributes.href,
        }), HTMLAttributes.label]
    },
})

// -----------------------------------------------------------------------------
// Editor instance
// -----------------------------------------------------------------------------

const isFocused = ref(false)

const editor = useEditor({
    content: props.modelValue,
    editable: props.editable,
    extensions: [
        StarterKit.configure({
            bold: hasFeature('bold') ? {} : false,
            italic: hasFeature('italic') ? {} : false,
            strike: hasFeature('strike') ? {} : false,
            heading: hasFeature('heading') ? { levels: headingLevels } : false,
            bulletList: hasFeature('bulletList') ? {} : false,
            orderedList: hasFeature('orderedList') ? {} : false,
            blockquote: hasFeature('blockquote') ? {} : false,
            codeBlock: hasFeature('codeBlock') ? {} : false,
            horizontalRule: hasFeature('horizontalRule') ? {} : false,
            code: {},
        }),
        ...(hasFeature('underline') ? [Underline] : []),
        ...(hasFeature('link') ? [Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } })] : []),
        ...(hasFeature('image') ? [ResizableImage.configure({ inline: false, allowBase64: false })] : []),
        ...(hasFeature('textAlign') ? [TextAlign.configure({ types: ['heading', 'paragraph'] })] : []),
        ...(hasFeature('table') ? [Table.configure({ resizable: true }), TableRow, TableHeader, TableCell] : []),
        ...(hasFeature('button') ? [ButtonNode] : []),
    ],
    onUpdate({ editor }) {
        const html = editor.getHTML()
        emit('update:modelValue', html)
        emit('change', html)
    },
    onFocus() { isFocused.value = true },
    onBlur() { isFocused.value = false },
})

watch(() => props.modelValue, (val) => {
    if (editor.value && editor.value.getHTML() !== val)
        editor.value.commands.setContent(val)
})
watch(() => props.editable, (val) => editor.value?.setEditable(val))
onBeforeUnmount(() => editor.value?.destroy())

// -----------------------------------------------------------------------------
// Modal state — Link
// -----------------------------------------------------------------------------

const showLinkModal = ref(false)
const linkUrl = ref('')
const linkLabel = ref('')
const linkBlank = ref(false)

function openLinkModal() {
    linkUrl.value = editor.value?.getAttributes('link').href ?? ''
    showLinkModal.value = true
}

function closeLinkModal() {
    showLinkModal.value = false
    linkUrl.value = '';
    linkLabel.value = '';
    linkBlank.value = false
}

function setLink() {
    if (!linkUrl.value) return
    if (linkLabel.value) {
        editor.value!.chain().focus()
            .insertContent(`<a href="${linkUrl.value}"${linkBlank.value ? ' target="_blank"' : ''}>${linkLabel.value}</a>`)
            .run()
    } else {
        editor.value!.chain().focus()
            .setLink({ href: linkUrl.value, target: linkBlank.value ? '_blank' : null })
            .run()
    }
    closeLinkModal()
}

// -----------------------------------------------------------------------------
// Modal state — Image
// -----------------------------------------------------------------------------

const showImageModal = ref(false)
const imageUrl = ref('')
const imageAlt = ref('')
const imageWidth = ref('')

function openImageModal() {
    showImageModal.value = true
}

function closeImageModal() {
    showImageModal.value = false
    imageUrl.value = ''; imageAlt.value = ''; imageWidth.value = ''
}

function insertImage() {
    if (!imageUrl.value) return
    editor.value!.chain().focus().setImage({
        src: imageUrl.value,
        alt: imageAlt.value || undefined,
        width: imageWidth.value || undefined,
    } as any).run()
    closeImageModal()
}

// -----------------------------------------------------------------------------
// Modal state — Button
// -----------------------------------------------------------------------------

const buttonVariantOptions = [
    { label: 'Primaire', key: 'primary' },
    { label: 'Gris', key: 'gray' },
    { label: 'Coutours', key: 'outline' },
]

const showButtonModal = ref(false)
const btnLabel = ref('')
const btnHref = ref('')
const btnVariant = ref<string | null>(null)

function openButtonModal() {
    showButtonModal.value = true
}

function closeButtonModal() {
    showButtonModal.value = false
    btnLabel.value = '';
    btnHref.value = '';
    btnVariant.value = null
}

function insertButton() {
    if (!btnLabel.value) return
    editor.value!.chain().focus().insertContent({
        type: 'customButton',
        attrs: { label: btnLabel.value, href: btnHref.value || '#', variant: btnVariant.value || 'primary' },
    }).run()
    closeButtonModal()
}
</script>

<style>
/* -- Root -------------------------------------------------------------------- */

.wysiwyg-editor {
    all: unset;
    z-index: 0;
    overflow: visible;
    --wy-bg: #ffffff;
    --wy-border: oklch(87.2% 0.01 258.338);
    --wy-toolbar-bg: #f8fafc;
    --wy-separator: #ced4db;
    --wy-content-min-h: 200px;
    --wy-radius: 8px;
}

/* -- Tiptap overrides ------------------------------------------------------- */

.resize-cursor {
    cursor: ew-resize !important;
}

.ProseMirror-focused {
    outline: none;
}

/* -- Toolbar ----------------------------------------------------------------- */

.wysiwyg-toolbar {
    position: sticky;
    top: calc(var(--header-height) - 8px);
    z-index: 10;
    /* Opacity transition for smooth hide/show when scrolling */
    transition: opacity 0.1s ease;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    align-items: center;
    padding: 6px 8px;
    background: var(--wy-toolbar-bg);
    border-radius: var(--wy-radius) var(--wy-radius) 0 0;
    border: 2px solid var(--wy-border);
}

.wysiwyg-toolbar__group {
    display: flex;
    gap: 1px;
    align-items: center;
}

.wysiwyg-toolbar__group+.wysiwyg-toolbar__group::before {
    content: '';
    display: block;
    width: 2px;
    height: 25px;
    background: var(--wy-separator);
    margin: 0 4px;
}

.wysiwyg-content {
    min-height: var(--wy-content-min-h);
    border-radius: 0 0 var(--wy-radius) var(--wy-radius);
    border: 2px solid var(--wy-border);
    border-top: none;
    padding: 16px;
    background: var(--wy-bg);
}
</style>