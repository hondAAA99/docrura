import { Repository } from 'typeorm';
import { baseRepo } from './base.repo.js';
import { User } from '../../database/user.model.js';
export declare class UsersRepo extends baseRepo<User> {
    constructor(usersRepository: Repository<User>);
}
