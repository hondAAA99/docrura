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
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UsersRepo } from '../../common/repository/user.repo.js';
import { securityServices } from '../../common/services/security/security.service.js';
import { userRoles } from '../../common/enum/user.base.enum.js';
import { ClientProxy } from '@nestjs/microservices';
import { messageEventsEnum } from '../../common/enum/messageEvents.enum.js';
import { generateOTP } from './utils/generateOTP.js';
import { emailKeyEnum } from '../../common/enum/emailSubject.enum.js';
let AuthService = class AuthService {
    userRepo;
    _security;
    _messageQueue;
    constructor(userRepo, _security, _messageQueue) {
        this.userRepo = userRepo;
        this._security = _security;
        this._messageQueue = _messageQueue;
    }
    async signUp(dto) {
        const { age, email, gender, name, password, phone_number } = dto;
        const checkEmail = await this.userRepo.findOne({
            email,
        });
        const emailData = {
            email,
            data: generateOTP(),
            subject: emailKeyEnum.confirmSignUp,
        };
        if (checkEmail) {
            if (!checkEmail.confirm) {
                this._messageQueue.emit(messageEventsEnum.email, emailData);
                return {
                    message: 'otp has sent to your email',
                };
            }
            else {
                throw new ForbiddenException('email already in use');
            }
        }
        const userInfo = {
            name,
            email,
            age,
            gender,
            password: this._security.globalHash(password),
            phone_number: this._security.Globalencrypt(phone_number),
            role: userRoles.user,
        };
        const user = await this.userRepo.save(userInfo);
        this._messageQueue.emit(messageEventsEnum.email, emailData);
        return {
            message: 'please confirm your email',
        };
    }
    async signIn() { }
    async registerGuest() { }
    async registerGuestAsUser() { }
    async confirmEmail() { }
    async refreshToken() { }
    async logout() { }
    async forgetPassword() { }
    async confirmOTP() { }
    async resendOTP() { }
    async resetPassword() { }
};
AuthService = __decorate([
    Injectable(),
    __param(2, Inject('NOTIFICATION_SERVICE')),
    __metadata("design:paramtypes", [UsersRepo,
        securityServices,
        ClientProxy])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map