
const STORAGE_KEY = 'brz-seen-popups';

const getSeenPopups = (): number[] => {
    if (import.meta.client) {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    return [];
};

const setSeenPopup = (seens: number[]) => {
    if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seens));
    }
};

export const hasSeenPopup = (id: number): boolean => {
    const seen = getSeenPopups();
    return seen.includes(id);
}

export const addToSeenPopups = (id: number) => {
    const seen = getSeenPopups();
    if (!seen.includes(id)) {
        seen.push(id);
        setSeenPopup(seen);
    }
}