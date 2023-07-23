import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class Contact {
  @ValidateIf((object: any, value: any) => value !== null)
  @IsMobilePhone()
  phoneNumber?: string;

  @ValidateIf((object: any, value: any) => value !== null)
  @IsEmail()
  email?: string;
}
