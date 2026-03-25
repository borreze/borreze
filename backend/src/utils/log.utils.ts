import { logService } from "../services/log.service";
import { Request } from 'express'
import { LogAttributesCreation, LogLevel } from "@brz/shared";

export class Log {
    /**
     * Create a log entry
     * @param message The log message
     * @param level The log level
     * @param req The request object
     * @param capture Whether to capture request data. Can be set to false to avoid logging sensitive data in the request body or query (e.g. for auth routes)
     * @returns The created log entry
     */
    private static async make(message: string, level: LogLevel, req?: Request, capture: boolean = true): Promise<Log> {
        const data: LogAttributesCreation = {
            message,
            level,
        }

        if (req) {
            data.user_agent = req.headers['user-agent']
            data.ip_address = req.ip || req.connection.remoteAddress || ''
            data.user_id = Number(req?.params?.user_id || req?.user?.id || 0) || null
            data.data = {
                url: req.originalUrl,
                method: req.method,
                body: capture ? req.body : undefined,
                query: capture ? req.query : undefined,
                params: req.params
            }
        }

        const log = await logService.create(data)

        return log
    }

    static emergency(msg: string, req?: Request, capture: boolean = true): void { Log.make(msg, "emergency", req, capture); }
    static alert(msg: string, req?: Request, capture: boolean = true): void { Log.make(msg, "alert", req, capture); }
    static critical(msg: string, req?: Request, capture: boolean = true): void { Log.make(msg, "critical", req, capture); }
    static error(msg: string, req?: Request, capture: boolean = true): void { Log.make(msg, "error", req, capture); }
    static warning(msg: string, req?: Request, capture: boolean = true): void { Log.make(msg, "warning", req, capture); }
    static notice(msg: string, req?: Request, capture: boolean = true): void { Log.make(msg, "notice", req, capture); }
    static info(msg: string, req?: Request, capture: boolean = true): void { Log.make(msg, "info", req, capture); }
    static debug(msg: string, req?: Request, capture: boolean = true): void { Log.make(msg, "debug", req, capture); }
}