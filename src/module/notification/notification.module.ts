import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { NotificationConsumer } from './notification.controller.js';
import { emailService } from '../../common/services/mailer/email.service.js';
import redisService from '../../common/services/redis/redis.service.js';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [NotificationConsumer],
  providers: [NotificationService, emailService, redisService, ConfigService],
})
export class NotificationModule {}
