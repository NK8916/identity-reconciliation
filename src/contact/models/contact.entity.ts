import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contact')
export class ContactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  phoneNumber: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  linkedId: number;

  @Column({ default: null })
  linkPrecedence: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: null })
  deletedAt: Date;
}
