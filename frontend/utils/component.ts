export function uniqueId(): string { // ! Avoid using it in template rendering, it can cause issues with hydration
    return Math.random().toString(36).substr(2, 9);
}