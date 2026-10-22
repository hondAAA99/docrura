import { Global, Module } from '@nestjs/common';
import redisService from './redis.service.js';
import { redisFactory } from '../../factories/redis.factory.js';

@Global()
@Module({
  providers: [redisService],
  exports: [redisService],
})
export class RedisModule {}
