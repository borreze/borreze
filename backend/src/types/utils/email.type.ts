export interface SendMailOptions {
    to: string
    subject: string
    text?: string | null
    html?: string | null
}