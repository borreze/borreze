import { normalize, isNormalized } from "./text.utils";

export const slugify = (text: string | null | undefined): string => normalize(text)

export const isSlugified = (text: string | null | undefined): boolean => isNormalized(text)
