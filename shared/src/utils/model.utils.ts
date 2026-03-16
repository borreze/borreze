export const slugify = (text: string | null | undefined): string => {
    if (!text) return ''

    return text
        .toString()
        .normalize('NFD')                     // separate accent from letter
        .replace(/[\u0300-\u036f]/g, '')      // remove all accents
        .toLowerCase()
        .trim()
        .replace(/['’]/g, '-')                // replace apostrophes
        .replace(/\s+/g, '-')                 // spaces -> -
        .replace(/[^\w-]+/g, '')              // remove non-word chars
        .replace(/--+/g, '-')                 // multiple - -> single -
        .replace(/^-+/, '')                   // trim - start
        .replace(/-+$/, '')                   // trim - end
}