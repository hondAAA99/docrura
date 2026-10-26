import { Repository } from 'typeorm';
import { baseRepo } from './base.repo.js';
import { revokeToken } from '../../database/revokeToken.model.js';
export declare class revokeTokensRepo extends baseRepo<revokeToken> {
    constructor(revokeTokensRepository: Repository<revokeToken>);
}
