import { ContactRequest } from "@brz/shared"
import { ContactException } from "../exceptions/contact.exception"
import { emailService } from "./email.service"

export class ContactService {
  public async send(data?: ContactRequest): Promise<boolean> {
    let { firstname, lastname, email, message } = data || {}

    if (!firstname || !lastname || !email || !message) {
      throw new ContactException('All fields are required')
    }

    firstname = firstname.trim()
    lastname = lastname.trim()
    email = email.trim()
    message = message.trim()

    await emailService.sendMail({
      to: process.env.BACKEND_CONTACT_MAIL_TO as string,
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
