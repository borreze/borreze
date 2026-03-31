import { USER_PASSWORD_SCORE_REQUIRED } from "../types/user.types";
import { passwordGetScore } from "./password.utils";

export const normalize = (text: string | null | undefined, keepNonWord = false): string => {
    if (!text) return ''

    let result = text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/['’]/g, '-')
        .replace(/\s+/g, '-')

    if (!keepNonWord) {
        result = result.replace(/[^\w-]+/g, '')
    }

    return result
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

export function buildUrl(template: string | null, data:  Record<string, unknown>): string {
    // Take a URL template like '/pages/<slug>' and replace placeholders with actual values from the data object

    if (!template) return '#'
    if (!template.includes('<') || !template.includes('>')) return template

    return template.replace(/<(\w+)>/g, (_, key) => {
        const value = data[key]
        if (value === undefined || value === null) {
            throw new Error(`Missing value for URL placeholder: ${key}`)
        }
        return encodeURIComponent(String(value))
    })
}

export function isEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255 && email.length >= 5 && !email.includes("&") && !email.includes(" ");
}

export function isPasswordStrong(password: string): boolean {
    return passwordGetScore(password) >= USER_PASSWORD_SCORE_REQUIRED
}

export function isURLRelative(url: string): boolean {
    return url.startsWith("/") &&
        !url.includes("://") &&
        !url.startsWith("http") &&
        !/\s/.test(url) &&
        !url.includes("..") &&
        !/[<>"'`|\\^{}[\]();:@&=+$,?#[\]~]/.test(url);
}

export function isURL(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}