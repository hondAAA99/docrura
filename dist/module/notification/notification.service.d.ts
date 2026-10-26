import { emailEventData } from '../../common/types/emailEventData.type.js';
import redisService from '../../common/services/redis/redis.service.js';
import { emailService } from '../../common/services/mailer/email.service.js';
import { securityServices } from '../../common/services/security/security.service.js';
export declare class NotificationService {
    private readonly _redisService;
    private readonly _emailService;
    private readonly _security;
    constructor(_redisService: redisService, _emailService: emailService, _security: securityServices);
    email(messageData: emailEventData): Promise<void>;
}
