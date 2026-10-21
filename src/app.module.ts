import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ConfigModule } from '@nestjs/config';
import { dataBaseFactory } from './common/factories/database.factory.js';
import { AuthModule } from './module/auth/auth.module.js';
import { redisFactory } from './common/factories/redis.factory.js';
import { NotificationModule } from './module/notification/notification.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'docura_server',
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    dataBaseFactory(),
    redisFactory(),

    AuthModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
