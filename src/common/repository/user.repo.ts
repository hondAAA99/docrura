import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { baseRepo } from './base.repo.js';
import { User } from '../../database/user.model.js';

@Injectable()
export class UsersRepo extends baseRepo<User> {
  constructor(
    @InjectRepository(User)
    usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }
}
