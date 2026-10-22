import type { RedisArgument, RedisClientType } from 'redis';
import { cacheKeyEnum } from '../../enum/cacheKey.enum.js';
declare class redisService {
    private readonly _client;
    constructor(_client: RedisClientType);
    cacheKey({ filter, subject }: {
        filter: string;
        subject: string;
    }): string;
    private keyExists;
    setKey({ key, value, ttl, }: {
        key: RedisArgument;
        value: RedisArgument;
        ttl: number;
    }): Promise<string | null>;
    getKey({ key }: {
        key: string;
    }): Promise<any>;
    getAllKeys(pattern: RedisArgument): Promise<string[]>;
    deleteKey({ key }: {
        key: RedisArgument;
    }): Promise<number>;
    getKeyTtl(key: RedisArgument): Promise<number>;
    incrKey(key: RedisArgument): Promise<void>;
    addSet({ filter, subject }: {
        filter: string;
        subject: cacheKeyEnum;
    }, members: string[]): Promise<number>;
    getSet({ filter, subject }: {
        filter: string;
        subject: cacheKeyEnum;
    }): Promise<string[]>;
    deleteSet({ filter, subject }: {
        filter: string;
        subject: cacheKeyEnum;
    }, members: string[]): Promise<number>;
    existsSet({ filter, subject, }: {
        filter: string;
        subject: cacheKeyEnum;
    }): Promise<number>;
    mget(keys: string[]): Promise<void>;
}
export default redisService;
