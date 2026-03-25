import { Optional } from 'sequelize'

export const LOG_RENTENTION_DAYS = 15

export const LOG_LEVELS_KEYS = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'] as const
export type LogLevel = typeof LOG_LEVELS_KEYS[number]
export const LOG_LEVELS_OBJECTS: { value: LogLevel, label: string, color?: string }[] = [
    { value: 'emergency', label: 'Emergency', color: '#E57373' },
    { value: 'alert', label: 'Alert', color: '#FFB074' },
    { value: 'critical', label: 'Critical', color: '#FFD580' },
    { value: 'error', label: 'Error', color: '#FFE082' },
    { value: 'warning', label: 'Warning', color: '#C5E1A5' },
    { value: 'notice', label: 'Notice', color: '#81C784' },
    { value: 'info', label: 'Info', color: '#80DEEA' },
    { value: 'debug', label: 'Debug', color: '#90CAF9' },
]

export interface LogAttributes {
    id: number
    level: LogLevel
    message: string
    data?: object | null
    user_id?: number | null
    ip_address?: string | null
    user_agent?: string | null
    created_at?: Date | null
}

export type LogAttributesCreation = Optional<LogAttributes, 'id' | 'data' | 'user_id' | 'ip_address' | 'user_agent' | 'created_at'>
