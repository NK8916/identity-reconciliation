import { Body, Controller, Post } from '@nestjs/common';
import { Contact } from '../models/contact.interface';
import { ContactService } from '../services/contact.service';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post('identity')
  create(@Body() contact: Contact): Promise<object> {
    return this.contactService.createContact(contact);
  }
}
