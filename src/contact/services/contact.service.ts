import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat } from 'rxjs';
import { In, Repository } from 'typeorm';
import { ContactEntity } from '../models/contact.entity';
import { Contact } from '../models/contact.interface';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  async createContact(contact: Contact): Promise<object> {
    let result = [];
    let existingContacts = [];
    if (contact.email && contact.phoneNumber) {
      const where = { email: contact.email, phoneNumber: contact.phoneNumber };
      existingContacts = await this.getContact(where);
      console.log('existingContacts', existingContacts);
    }

    if (existingContacts.length) {
      const existingContact = existingContacts[0];
      //   console.log('existingContacts', existingContacts);
      //   contact['linkedId'] = existingContact.id;
      //   contact['linkPrecedence'] = 'secondary';
      //   await this.contactRepository.save(contact);
      const linkedId = existingContact?.linkedId || existingContact?.id;
      console.log('linkedId', linkedId);
      const linkedContacts = await this.getLinkedContacts(linkedId);
      console.log('linkedContacts', linkedContacts);
      result = this.formatContactResponse(existingContacts, linkedContacts);
    } else {
      const where = [
        { email: contact.email },
        { phoneNumber: contact.phoneNumber },
      ];
      existingContacts = await this.getContact(where);
      console.log('existingContacts', existingContacts);
      console.log('else');
      if (existingContacts.length) {
        const primaryContacts = existingContacts.filter(
          (item) => item.linkPrecedence == 'primary',
        );
        const phoneDataExist = existingContacts.find(
          (item) => item.phoneNumber == contact.phoneNumber,
        );
        const emailDataExist = existingContacts.find(
          (item) => item.email == contact.email,
        );
        let linkedId = null;
        console.log('primaryContacts', primaryContacts);
        const protentialSecondaryContacts = primaryContacts.slice(1);
        if (
          protentialSecondaryContacts.length &&
          phoneDataExist &&
          emailDataExist
        ) {
          this.contactRepository.save({
            ...protentialSecondaryContacts,
            linkPrecedence: 'secondary',
          });
        } else if (!phoneDataExist && !emailDataExist) {
          contact['linkPrecedence'] = 'primary';
          const savedContact = await this.contactRepository.save(contact);
          console.log('savedContact', savedContact);
          linkedId = savedContact?.linkedId || savedContact?.id;
        } else if (!phoneDataExist) {
          const primaryContact = primaryContacts[0];
          linkedId = primaryContact?.linkedId || primaryContact?.id;
          contact['linkPrecedence'] = 'secondary';
          contact['linkedId'] = linkedId;
          await this.contactRepository.save(contact);
        } else if (!emailDataExist) {
          const primaryContact = primaryContacts[0];
          linkedId = primaryContact?.linkedId || primaryContact?.id;
          contact['linkPrecedence'] = 'secondary';
          contact['linkedId'] = linkedId;
          await this.contactRepository.save(contact);
        }

        console.log('linkedId', linkedId);
        const linkedContacts = await this.getLinkedContacts(linkedId);
        result = this.formatContactResponse(primaryContacts, linkedContacts);
        console.log('linkedContacts', linkedContacts);
      }
    }
    return result;
  }

  formatContactResponse(
    existingContacts: ContactEntity[],
    linkedContacts?: ContactEntity[],
  ): any {
    let result = null;
    try {
      let primaryContact = null;
      const primaryContacts = existingContacts
        .filter((item) => item.linkPrecedence == 'primary')
        .concat(
          linkedContacts.filter((item) => item.linkPrecedence == 'primary'),
        );
      if (primaryContacts) {
        primaryContact = primaryContacts[0];
      }
      console.log('primaryContact', primaryContact);
      const primaryContactId = primaryContact.id || primaryContact.linkedId;
      console.log('primaryContactId', primaryContactId);
      const secondaryEmails = linkedContacts
        .filter((item) => item.id != primaryContactId)
        .map((item) => item.email);

      const secondaryPhoneNumbers = linkedContacts
        .filter((item) => item.id != primaryContactId)
        .map((item) => item.phoneNumber);

      const secondaryIds = linkedContacts
        .filter((item) => item.id != primaryContactId)
        .map((item) => item.id);

      result = {
        primaryContactId: primaryContactId,
        emails: [primaryContact.email].concat(secondaryEmails),
        phoneNumbers: [primaryContact.phoneNumber].concat(
          secondaryPhoneNumbers,
        ),
        secondaryContactIds: secondaryIds,
      };
    } catch (e) {
      const error: Error = e.message;
      result = error;
    }
    return result;
  }

  getLinkedContacts(linkedId: number): Promise<ContactEntity[]> {
    return this.contactRepository.find({
      where: [{ linkedId: linkedId }, { id: linkedId }],
      order: {
        id: 'ASC',
      },
    });
  }

  getContact(where: object): Promise<ContactEntity[]> {
    return this.contactRepository.find({ where: where });
  }
}
