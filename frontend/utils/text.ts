export function limitString(text: string, max: number = 100, suffix: string = " ..."): string {
    if (!text) return "";
    if (text.length <= max) return text;
    return text.slice(0, max).trim() + suffix;
}

export function hello(): string {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        return "Bonjour";
    } else if (hour >= 12 && hour < 17) {
        return "Bon après-midi";
    } else {
        return "Bonsoir";
    }
}