import { NotificationService } from './notification.service.js';
import type { emailEventData } from '../../common/types/emailEventData.type.js';
export declare class NotificationConsumer {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    consumeEmailMessages(data: emailEventData): Promise<void>;
}
