export function isEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255 && email.length >= 5 && !email.includes("&") && !email.includes(" ");
}