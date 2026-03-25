import { RequestHandler } from 'express'
import { contactService } from '../services/contact.service'
import { Return } from '../types/utils/api.types'
import { Log } from '../utils/log.utils'

export class ContactController {
  public send: RequestHandler = async (req, res) => {
    await contactService.send(req.body)
    Log.info(`Une demande de contact a été envoyée par ${req.body.email} avec le sujet "${req.body.subject}"`, req)
    res.status(200).json({ message: 'Contact request sent successfully' } as Return)
  }
}

export const contactController = new ContactController()
