var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import redisService from '../../common/services/redis/redis.service.js';
import { emailService } from '../../common/services/mailer/email.service.js';
let NotificationService = class NotificationService {
    _redisService;
    _emailService;
    constructor(_redisService, _emailService) {
        this._redisService = _redisService;
        this._emailService = _emailService;
    }
    async email(messageData) {
        const { data, email, subject } = messageData;
        try {
            await this._redisService.setKey({
                key: this._redisService.cacheKey({
                    filter: email,
                    subject,
                }),
                value: data.toString(),
                ttl: 3 * 60,
            });
            await this._emailService.sendEmail({
                to: email,
                subject,
                data,
            });
        }
        catch (error) {
            console.log(error);
        }
        console.log(`an email has been sent to ${email}`);
    }
};
NotificationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [redisService,
        emailService])
], NotificationService);
export { NotificationService };
//# sourceMappingURL=notification.service.js.map