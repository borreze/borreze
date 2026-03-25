import { normalize } from "./text.utils";

export const slugify = (text: string | null | undefined): string => normalize(text)
