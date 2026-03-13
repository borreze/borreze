import { Optional } from 'sequelize'

export const LOG_LEVELS_KEYS = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'] as const
export type LogLevel = typeof LOG_LEVELS_KEYS[number]
export const LOG_LEVELS_OBJECTS: { value: LogLevel, label: string }[] = [
    { value: 'emergency', label: 'Emergency' },
    { value: 'alert', label: 'Alert' },
    { value: 'critical', label: 'Critical' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'notice', label: 'Notice' },
    { value: 'info', label: 'Info' },
    { value: 'debug', label: 'Debug' },
]

export interface LogAttributes {
    id: number
    level: LogLevel
    message: string
    context?: object | null
    user_id?: number | null
    ip_address?: string | null
    user_agent?: string | null
    created_at?: Date | null
}

export type LogAttributesCreation = Optional<LogAttributes, 'id' | 'context' | 'user_id' | 'ip_address' | 'user_agent' | 'created_at'>
