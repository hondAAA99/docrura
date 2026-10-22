import { emailEventData } from '../../common/types/emailEventData.type.js';
import redisService from '../../common/services/redis/redis.service.js';
import { emailService } from '../../common/services/mailer/email.service.js';
export declare class NotificationService {
    private readonly _redisService;
    private readonly _emailService;
    constructor(_redisService: redisService, _emailService: emailService);
    email(messageData: emailEventData): Promise<void>;
}
