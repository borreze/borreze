export function limitString(text: string, max: number = 100, suffix: string = " ..."): string {
    if (!text) return "";
    if (text.length <= max) return text;
    return text.slice(0, max).trim() + suffix;
}