import rateLimit, { Options as RateLimitOptions } from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";

export enum TimeSpans {
    ONE_SECOND = 1 * 1000,
    ONE_MINUTE = 60 * 1000,
    FIVE_MINUTE = 5 * 60 * 1000,
    FIFTEEN_MINUTES = 15 * 60 * 1000,
    ONE_HOUR = 60 * 60 * 1000,
    ONE_DAY = 24 * 60 * 60 * 1000,
}

export type TimeSpanKey = keyof typeof TimeSpans;

/**
 * Creates a rate limiter middleware for Express.
 * @param max Maximum number of requests allowed per window.
 * @param span Time span key from the TimeSpans enum. Defaults to FIFTEEN_MINUTES.
 */
export const createRateLimiter = (max: number = 50, span: TimeSpanKey = "FIFTEEN_MINUTES") => {
    if (config.env === 'development') { // ! THERE IS NO RATE LIMIT IN DEV MODE TO AVOID HINDERING TESTS
        return (req: Request, res: Response, next: NextFunction) => next();
    }

    const windowMs = TimeSpans[span] ?? TimeSpans.FIFTEEN_MINUTES;

    const options: Partial<RateLimitOptions> = {
        windowMs,
        max,
        message: 'Connection lost', // False message to avoid leaking rate limit info
        standardHeaders: true,
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    };

    return rateLimit(options);
};

export default createRateLimiter;
