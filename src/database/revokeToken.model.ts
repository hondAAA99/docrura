import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model.js';
import { userTokenEnum } from '../common/enum/user.base.enum.js';

@Entity('revokeToken')
export class revokeToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column('varchar')
  token!: string;
  @Column('date')
  expiresIn!: Date;
  @Column('uuid')
  userId!: string;
  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'userId' })
  user!: User;
  @Column('enum', { enum: userTokenEnum })
  type!: string;
  @Column('date')
  timestamp: Date;
}
