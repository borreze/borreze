import { ContactRequest } from "@brz/shared"
import { ContactException } from "../exceptions/contact.exception"
import { emailService } from "./email.service"
import { config } from "../config/config"

export class ContactService {
  public async send(data?: ContactRequest): Promise<boolean> {
    let { firstname, lastname, email, message } = data || {}

    if (!firstname || !lastname || !email || !message) {
      throw new ContactException('All fields are required')
    }

    if (message.length < 100) {
      throw new ContactException('Message must be at least 100 characters long')
    }

    firstname = firstname.trim()
    lastname = lastname.trim()
    email = email.trim()
    message = message.trim()

    await emailService.sendMail({
      to: config.contactMailTo,
      subject: `Demande de contact ${email} - Borrèze`,
      html: `
        <h1>Demande de contact</h1>
        <p><strong>Prénom :</strong> ${firstname}</p>
        <p><strong>Nom :</strong> ${lastname}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong> ${message}</p>
      `
    })

    return true
  }
}

export const contactService = new ContactService()
