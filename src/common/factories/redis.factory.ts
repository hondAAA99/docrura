import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const REDIS_CLIENT = 'Redis_Client';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const client = createClient({
          url: config.get<string>('REDIS_URI'),
        });

        client.on('error', (err) => {
          console.error('Redis Client Error:', err);
        });

        await client
          .connect()
          .then(() => console.log('cache server is running '));

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisClientModule {}

export function redisFactory() {
  return RedisClientModule;
}
