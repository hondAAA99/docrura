import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { baseRepo } from './base.repo.js';
import { revokeToken } from '../../database/revokeToken.model.js';

@Injectable()
export class revokeTokensRepo extends baseRepo<revokeToken> {
  constructor(
    @InjectRepository(revokeToken)
    revokeTokensRepository: Repository<revokeToken>,
  ) {
    super(revokeTokensRepository);
  }
}
