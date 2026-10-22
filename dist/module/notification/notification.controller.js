var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { EventPattern, Payload } from '@nestjs/microservices';
import { messageEventsEnum } from '../../common/enum/messageEvents.enum.js';
let NotificationConsumer = class NotificationConsumer {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async consumeEmailMessages(data) {
        await this.notificationService.email(data);
    }
};
__decorate([
    EventPattern(messageEventsEnum.email),
    __param(0, Payload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationConsumer.prototype, "consumeEmailMessages", null);
NotificationConsumer = __decorate([
    Controller('notification'),
    __metadata("design:paramtypes", [NotificationService])
], NotificationConsumer);
export { NotificationConsumer };
//# sourceMappingURL=notification.controller.js.map