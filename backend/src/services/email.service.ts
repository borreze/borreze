import nodemailer from 'nodemailer'
import { SendMailOptions } from '../types/utils/email.type'
import { Terminal } from '../utils/terminal.utils'

export class EmailService {
    private transporter

    constructor() {
        const host = process.env.BACKEND_SMTP_HOST
        const port = Number(process.env.BACKEND_SMTP_PORT ?? 587)
        const user = process.env.BACKEND_SMTP_USER
        const pass = process.env.BACKEND_SMTP_PASS

            if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass }
            })
        }
    }

    public async sendMail(options: SendMailOptions): Promise<void> {
        const from = process.env.BACKEND_SMTP_FROM ?? 'no-reply@borreze.fr'

        if (!options?.text) return 
        if (!options?.html) return 

        if (!this.transporter) {
            Terminal.warn(`EmailService not configured. Mail would be: ${JSON.stringify({ from, ...options }, null, 2)}`)
            return
        }

        await this.transporter.sendMail({
            from,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        })
    }
}

export const emailService = new EmailService()
