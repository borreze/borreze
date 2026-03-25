import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function required(key: string): string {
    const val = process.env[key];
    if (!val || val.trim() === '') {
        throw new Error(`Missing required env variable: ${key}`);
    }
    return val.trim();
}

function optional(key: string, fallback: string): string {
    return process.env[key]?.trim() || fallback;
}

export const config = {
    port: (required('BACKEND_PORT') as unknown as number),
    env: (required('NODE_ENV') as 'development' | 'production' | 'test'),
    corsOrigin: (optional('BACKEND_CORS_ORIGIN', '*') as string).split(',').map(origin => origin.trim()),
    appName: (optional('BACKEND_APP_NAME', 'app') as string),
    dockerized: (optional('DOCKERIZED', 'false').toLowerCase() === 'true'),
    // JWT
    jwtSecret: (required('BACKEND_JWT_SECRET') as string),
    jwtExpires: (optional('BACKEND_JWT_EXPIRES', '15m') as jwt.SignOptions['expiresIn']),
    bcryptSaltRounds: (optional('BACKEND_BCRYPT_SALT_ROUNDS', '12') as unknown as number),
    // Email
    contactMailTo: (required('BACKEND_CONTACT_MAIL_TO') as string),
    smtpHost: (required('BACKEND_SMTP_HOST') as string),
    smtpPort: (optional('BACKEND_SMTP_PORT', '587') as unknown as number),
    smtpUser: (required('BACKEND_SMTP_USER') as string),
    smtpPass: (required('BACKEND_SMTP_PASS') as string),
    smtpFrom: (required('BACKEND_SMTP_FROM') as string),
    // DB
    dbHost: (required('DATABASE_HOST') as string),
    dbPort: (optional('DATABASE_PORT', '5432') as unknown as number),
    dbName: (required('DATABASE_NAME') as string),
    dbUser: (required('DATABASE_USER') as string),
    dbPassword: (required('DATABASE_PASSWORD') as string),
} as const;