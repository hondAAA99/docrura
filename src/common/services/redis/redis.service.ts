import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { RedisArgument, RedisClientType } from 'redis';
import { cacheKeyEnum } from '../../enum/cacheKey.enum.js';
import { REDIS_CLIENT } from '../../factories/redis.factory.js';

@Injectable()
class redisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly _client: RedisClientType,
  ) {}

  cacheKey({ filter, subject }: { filter: string; subject: string }): string {
    return `${subject}::${filter}`;
  }

  private async keyExists({ key }: { key: RedisArgument }): Promise<number> {
    return await this._client.exists(key);
  }

  async setKey({
    key,
    value,
    ttl = 60,
  }: {
    key: RedisArgument;
    value: RedisArgument;
    ttl: number;
  }) {
    try {
      value =
        (typeof value as any) == 'string'
          ? value
          : JSON.stringify(value, null, 2);
      return await this._client.set(key, value, { EX: ttl });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getKey({ key }: { key: string }) {
    try {
      const value = await this._client.get(key);
      try {
        return JSON.parse(value!);
      } catch (err) {
        return value;
      }
    } catch (err) {
      throw new InternalServerErrorException(
        'failed to get the value from cache',
      );
    }
  }

  async getAllKeys(pattern: RedisArgument) {
    try {
      const value = await this._client.keys(pattern);
      return value;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async deleteKey({ key }: { key: RedisArgument }) {
    try {
      const keyExists = await this.keyExists({ key });
      if (keyExists <= 0) {
        throw new InternalServerErrorException('key expiered');
      }
      const value = await this._client.del(await this.getAllKeys(key));
      return value;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getKeyTtl(key: RedisArgument) {
    try {
      const keyExists = await this.keyExists({ key });
      if (keyExists <= 0) {
        throw new InternalServerErrorException('key expiered');
      }
      const value = await this._client.ttl(key);
      return value;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async incrKey(key: RedisArgument) {
    try {
      await this._client.incr(key);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async addSet(
    { filter, subject }: { filter: string; subject: cacheKeyEnum },
    members: string[],
  ): Promise<number> {
    return await this._client.sAdd(
      this.cacheKey({
        filter,
        subject,
      }),
      members,
    );
  }

  async getSet({ filter, subject }: { filter: string; subject: cacheKeyEnum }) {
    return await this._client.sMembers(
      this.cacheKey({
        filter,
        subject,
      }),
    );
  }

  async deleteSet(
    { filter, subject }: { filter: string; subject: cacheKeyEnum },
    members: string[],
  ) {
    return await this._client.sRem(
      this.cacheKey({
        filter,
        subject,
      }),
      members,
    );
  }

  async existsSet({
    filter,
    subject,
  }: {
    filter: string;
    subject: cacheKeyEnum;
  }) {
    return await this._client.sCard(
      this.cacheKey({
        filter,
        subject,
      }),
    );
  }

  async mget(keys: string[]) {
    await this._client.MGET(keys);
  }
}

export default redisService;
