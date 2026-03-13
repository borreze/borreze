import { logService } from "../services/log.service";
import { Request } from 'express'
import { LogAttributesCreation, LogLevel } from "@brz/shared";

export class Log {
    private static async make(message: string, level: LogLevel, req?: Request): Promise<Log> {
        const data: LogAttributesCreation = {
            message,
            level,
        }

        if (req) {
            data.user_agent = req.headers['user-agent']
            data.ip_address = req.ip || req.connection.remoteAddress || ''
            data.user_id = Number(req?.params?.user_id || 0) || null
            data.context = {
                url: req.originalUrl,
                method: req.method,
                // body: req.body,
                // query: req.query,
                params: req.params
            }
        }

        const log = await logService.create(data)

        return log
    }

    static emergency(msg: string, req?: Request): void { Log.make(msg, "emergency", req); }
    static alert(msg: string, req?: Request): void { Log.make(msg, "alert", req); }
    static critical(msg: string, req?: Request): void { Log.make(msg, "critical", req); }
    static error(msg: string, req?: Request): void { Log.make(msg, "error", req); }
    static warning(msg: string, req?: Request): void { Log.make(msg, "warning", req); }
    static notice(msg: string, req?: Request): void { Log.make(msg, "notice", req); }
    static info(msg: string, req?: Request): void { Log.make(msg, "info", req); }
    static debug(msg: string, req?: Request): void { Log.make(msg, "debug", req); }
}