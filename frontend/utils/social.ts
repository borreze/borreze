import type { SocialType } from "~/types/social";

export const socialTypes: Record<SocialType, { icon: string; urlBase: string; }> = {
    facebook: {
        icon: 'cib:facebook',
        urlBase: 'https://www.facebook.com/',
    },
    instagram: {
        icon: 'cib:instagram',
        urlBase: 'https://www.instagram.com/',
    },
    other: {
        icon: 'ic:twotone-link',
        urlBase: '#',
    }
}

export function getSocialIcon(type: SocialType): string {
    const socialType = socialTypes[type]
    if (!socialType) throw new Error(`Unknown social type: ${type}`)

    return socialType.icon
}

export function createSocialUrl(type: SocialType, pseudo: string): string {
    const socialType = socialTypes[type]
    if (!socialType) throw new Error(`Unknown social type: ${type}`)

    return `${socialType.urlBase}${pseudo}`
}
