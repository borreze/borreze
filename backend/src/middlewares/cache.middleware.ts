import { Request, Response, NextFunction } from 'express'
import { config } from "../config/config";

export enum TimeSpans {
    ONE_HOUR = 60 * 60,
    ONE_DAY = 24 * 60 * 60,
    TWO_DAYS = 2 * 24 * 60 * 60,
    ONE_WEEK = 7 * 24 * 60 * 60,
    TWO_WEEKS = 2 * 7 * 24 * 60 * 60,
    ONE_MONTH = 30 * 24 * 60 * 60,
    TWO_MONTHS = 2 * 30 * 24 * 60 * 60,
    SIX_MONTHS = 6 * 30 * 24 * 60 * 60,
    ONE_YEAR = 365 * 24 * 60 * 60,
    FOREVER = 10 * 365 * 24 * 60 * 60, // actually 10 years, but close enough
}

export type TimeSpanKey = keyof typeof TimeSpans;

/**
 * Sets Cache-Control headers for aggressive browser caching.
 * @param maxAge Cache duration in seconds (default: 1 year)
 */
export function cacheControl(span: TimeSpanKey = "ONE_DAY") {
    if (config.env === 'development') { // ! THERE IS NO CACHE IN DEV MODE TO AVOID HINDERING TESTS
        return (req: Request, res: Response, next: NextFunction) => next();
    }

    const maxAge = TimeSpans[span] ?? TimeSpans.ONE_DAY;

    return (req: Request, res: Response, next: NextFunction) => {
        res.set('Cache-Control', `public, max-age=${maxAge}, immutable`)
        next()
    }
}