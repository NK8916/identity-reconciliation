import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './services/contact.service';
import { ContactController } from './controller/contact.controller';
import { ContactEntity } from './models/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
