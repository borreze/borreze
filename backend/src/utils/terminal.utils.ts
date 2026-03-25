import { config } from "../config/config";
import { TERMINAL_STYLES, TerminalStyleName, TerminalStyleType } from "../types/utils/terminal.types";

export class Terminal {
    private static readonly appName = config.appName;

    private static getColor(styleName: TerminalStyleName): string {
        return TERMINAL_STYLES.find((c) => c.name === styleName)!.code;
    }

    private static getMethod(styleType: TerminalStyleType): (...args: unknown[]) => void {
        switch (styleType) {
            case "error": return console.error;
            case "warn": return console.warn;
            default: return console.info;
        }
    }

    private static format(msg: string): string {
        return `[${Terminal.appName}] ${msg}`;
    }

    private static print(styleType: TerminalStyleType, styleName: TerminalStyleName, msg: string): void {
        const formatted = Terminal.format(msg);
        const color = Terminal.getColor(styleName);
        const method = Terminal.getMethod(styleType);

        method(color, formatted);
    }

    static log(msg: string): void { Terminal.print("default", "white", msg); }
    static info(msg: string): void { Terminal.print("info", "blue", msg); }
    static success(msg: string): void { Terminal.print("success", "green", msg); }
    static warn(msg: string): void { Terminal.print("warn", "yellow", msg); }
    static error(msg: string): void { Terminal.print("error", "red", msg); }
}