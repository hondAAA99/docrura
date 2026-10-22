import { Injectable } from '@nestjs/common';
import { emailEventData } from '../../common/types/emailEventData.type.js';
import redisService from '../../common/services/redis/redis.service.js';
import { emailService } from '../../common/services/mailer/email.service.js';

@Injectable()
export class NotificationService {
  constructor(
    private readonly _redisService: redisService,
    private readonly _emailService: emailService,
  ) {}

  async email(messageData: emailEventData) {
    const { data, email, subject } = messageData;

    try {
      // cache the otp
      await this._redisService.setKey({
        key: this._redisService.cacheKey({
          filter: email,
          subject,
        }),
        value: data.toString(),
        ttl: 3 * 60,
      });

      // send the email
      await this._emailService.sendEmail({
        to: email,
        subject,
        data,
      });
    } catch (error) {
      console.log(error);
    }

    console.log(`an email has been sent to ${email}`);
  }
}
