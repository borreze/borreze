import { Optional } from 'sequelize'
import { LOG_LEVELS } from '../../models/log.model'

export type LogLevel = typeof LOG_LEVELS[number]

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
