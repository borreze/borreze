import nodemailer from 'nodemailer'
import { SendMailOptions } from '../types/utils/email.type'
import { Terminal } from '../utils/terminal.utils'
import { MailException } from '../exceptions/mail.exception'
import { config } from '../config/config'

export class EmailService {
    private transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: config.smtpPort,
            secure: config.smtpPort === 465,
            auth: { user: config.smtpUser, pass: config.smtpPass }
        })
    }

    public async sendMail(options: SendMailOptions): Promise<void> {
        const { to, subject, text, html } = options

        if (!to) throw new MailException('Email "to" field is required')
        if (!text && !html) throw new MailException('Email "text" or "html" field is required')

        if (config.env !== 'production') {
            Terminal.info(`Mail sent: ${JSON.stringify({ from: config.smtpFrom, ...options }, null, 2)}`)
            return
        }

        await this.transporter.sendMail({
            from: config.smtpFrom, to, subject,
            ...(text ? { text } : {}),
            ...(html ? { html } : {})
        })
    }
}

export const emailService = new EmailService()
