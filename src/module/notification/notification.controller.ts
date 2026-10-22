import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { messageEventsEnum } from '../../common/enum/messageEvents.enum.js';
import type { emailEventData } from '../../common/types/emailEventData.type.js';

@Controller('notification')
export class NotificationConsumer {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(messageEventsEnum.email)
  async consumeEmailMessages(@Payload() data: emailEventData) {
    await this.notificationService.email(data);
  }
}
