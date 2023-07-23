import { Body, Controller, Post } from '@nestjs/common';
import { Contact } from '../models/contact.dto';
import { ContactService } from '../services/contact.service';

@Controller('identity')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post('')
  create(@Body() contact: Contact): Promise<object> {
    return this.contactService.createContact(contact);
  }
}
