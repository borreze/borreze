import { Optional } from 'sequelize'

export const LOG_RENTENTION_DAYS = 30

export const LOG_LEVELS_KEYS = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'] as const
export type LogLevel = typeof LOG_LEVELS_KEYS[number]
export const LOG_LEVELS_OBJECTS: { value: LogLevel, label: string, color?: string }[] = [
    { value: 'emergency', label: 'Emergency', color: '#FF0000' },
    { value: 'alert', label: 'Alert', color: '#FF7F00' },
    { value: 'critical', label: 'Critical', color: '#FFBF00' },
    { value: 'error', label: 'Error', color: '#FFFF00' },
    { value: 'warning', label: 'Warning', color: '#7FFF00' },
    { value: 'notice', label: 'Notice', color: '#00FF00' },
    { value: 'info', label: 'Info', color: '#00FFFF' },
    { value: 'debug', label: 'Debug', color: '#0000FF' },
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
