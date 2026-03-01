export function keepKeys(obj: object, keys: string[]) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => keys.includes(key))
    );
}

export function getByKey(obj: object, key: string): unknown {
    return Object.entries(obj).find(([k]) => k === key)?.[1]
}