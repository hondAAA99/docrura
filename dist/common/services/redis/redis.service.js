var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable, InternalServerErrorException, } from '@nestjs/common';
import { REDIS_CLIENT } from '../../factories/redis.factory.js';
let redisService = class redisService {
    _client;
    constructor(_client) {
        this._client = _client;
    }
    cacheKey({ filter, subject }) {
        return `${subject}::${filter}`;
    }
    async keyExists({ key }) {
        return await this._client.exists(key);
    }
    async setKey({ key, value, ttl = 60, }) {
        try {
            value =
                typeof value == 'string'
                    ? value
                    : JSON.stringify(value, null, 2);
            return await this._client.set(key, value, { EX: ttl });
        }
        catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
    async getKey({ key }) {
        try {
            const value = await this._client.get(key);
            try {
                return JSON.parse(value);
            }
            catch (err) {
                return value;
            }
        }
        catch (err) {
            throw new InternalServerErrorException('failed to get the value from cache');
        }
    }
    async getAllKeys(pattern) {
        try {
            const value = await this._client.keys(pattern);
            return value;
        }
        catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
    async deleteKey({ key }) {
        try {
            const keyExists = await this.keyExists({ key });
            if (keyExists <= 0) {
                throw new InternalServerErrorException('key expiered');
            }
            const value = await this._client.del(await this.getAllKeys(key));
            return value;
        }
        catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
    async getKeyTtl(key) {
        try {
            const keyExists = await this.keyExists({ key });
            if (keyExists <= 0) {
                throw new InternalServerErrorException('key expiered');
            }
            const value = await this._client.ttl(key);
            return value;
        }
        catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
    async incrKey(key) {
        try {
            await this._client.incr(key);
        }
        catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
    async addSet({ filter, subject }, members) {
        return await this._client.sAdd(this.cacheKey({
            filter,
            subject,
        }), members);
    }
    async getSet({ filter, subject }) {
        return await this._client.sMembers(this.cacheKey({
            filter,
            subject,
        }));
    }
    async deleteSet({ filter, subject }, members) {
        return await this._client.sRem(this.cacheKey({
            filter,
            subject,
        }), members);
    }
    async existsSet({ filter, subject, }) {
        return await this._client.sCard(this.cacheKey({
            filter,
            subject,
        }));
    }
    async mget(keys) {
        await this._client.MGET(keys);
    }
};
redisService = __decorate([
    Injectable(),
    __param(0, Inject(REDIS_CLIENT)),
    __metadata("design:paramtypes", [Object])
], redisService);
export default redisService;
//# sourceMappingURL=redis.service.js.map