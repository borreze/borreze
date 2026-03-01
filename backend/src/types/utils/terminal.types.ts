export const TERMINAL_STYLES = [
    { type: "default", name: "white", code: "\x1b[37m%s\x1b[0m" },
    { type: "info", name: "blue", code: "\x1b[34m%s\x1b[0m" },
    { type: "success", name: "green", code: "\x1b[32m%s\x1b[0m" },
    { type: "warn", name: "yellow", code: "\x1b[33m%s\x1b[0m" },
    { type: "error", name: "red", code: "\x1b[31m%s\x1b[0m" },
] as const;

export type TerminalStyleType = typeof TERMINAL_STYLES[number]["type"];
export type TerminalStyleName = typeof TERMINAL_STYLES[number]["name"];
