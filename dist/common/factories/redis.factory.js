var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
export const REDIS_CLIENT = 'Redis_Client';
let RedisClientModule = class RedisClientModule {
};
RedisClientModule = __decorate([
    Global(),
    Module({
        imports: [ConfigModule],
        providers: [
            {
                provide: REDIS_CLIENT,
                inject: [ConfigService],
                useFactory: async (config) => {
                    const client = createClient({
                        url: config.get('REDIS_URI'),
                    });
                    client.on('error', (err) => {
                        console.error('Redis Client Error:', err);
                    });
                    await client.connect();
                    return client;
                },
            },
        ],
        exports: [REDIS_CLIENT],
    })
], RedisClientModule);
export { RedisClientModule };
export function redisFactory() {
    return RedisClientModule;
}
//# sourceMappingURL=redis.factory.js.map