import { RequestHandler } from 'express'
import { contactService } from '../services/contact.service'
import { Return } from '../types/utils/api.types'

export class ContactController {
  public send: RequestHandler = async (req, res) => {
    await contactService.send(req.body)
    res.json({ message: 'Contact request sent successfully' } as Return)
  }
}

export const contactController = new ContactController()
