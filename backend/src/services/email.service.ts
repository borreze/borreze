import nodemailer from 'nodemailer'
import { SendMailOptions } from '../types/utils/email.type'
import { Terminal } from '../utils/terminal.utils'
import { MailException } from '../exceptions/mail.exception'

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
        const { to, subject, text, html } = options

        const from = process.env.BACKEND_SMTP_FROM

        if (!this.transporter) throw new MailException('SMTP transporter is not configured. Check environment variables.')
        if (!to) throw new MailException('Email "to" field is required')
        if (!from) throw new MailException('Email "from" field is required')
        if (!text || !html) throw new MailException('Email "text" or "html" field is required')

        if (process.env.NODE_ENV !== 'production') {
            Terminal.info(`Mail sent: ${JSON.stringify({ from, ...options }, null, 2)}`)
            return
        }

        await this.transporter.sendMail({ from, to, subject, text, html })
    }
}

export const emailService = new EmailService()
