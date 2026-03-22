import { USER_PASSWORD_SCORE_REQUIRED } from "../types/user.types";
import { passwordGetScore } from "./password.utils";

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