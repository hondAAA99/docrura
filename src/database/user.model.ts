import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  userGender,
  userProvider,
  userRoles,
} from '../common/enum/user.base.enum.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar', { nullable: true })
  name!: string;
  @Column('varchar', { unique: true, nullable: true })
  email!: string;
  @Column('varchar', { nullable: true })
  password!: string;
  @Column('enum', {
    enum: userGender,
    default: userGender.female,
    nullable: true,
  })
  gender!: string;
  @Column('enum', {
    enum: userRoles,
    default: userRoles.user,
  })
  role!: string;
  @Column('boolean', { default: false })
  confirm!: boolean;
  @Column('varchar', { unique: true, nullable: true })
  phone_number!: string;
  @Column('varchar', { nullable: true })
  age!: string;
  @Column('enum', { enum: userProvider, default: userProvider.system })
  provider!: string;
  @Column('date', { nullable: true })
  credentials: Date;
}
