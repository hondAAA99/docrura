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
import { BadRequestException, Body, Controller, Get, Headers, Post, Query, Req, UseGuards, ValidationPipe, } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { signUpDTO } from './validation/signUp.dto.js';
import { signInDTO } from './validation/signin.dto.js';
import { GoogleAuthGuard } from '../../common/guard/google.guard.js';
import { User } from '../../common/decorators/user.decorator.js';
import { registerGuestAsUserDTO } from './validation/registerGuestAsUser.dto.js';
import { authenticationGuard } from '../../common/guard/authentication/authentication.guard.js';
import { User as UserModel } from '../../database/user.model.js';
import { confirmEmailDTO } from './validation/confirmEmail.dto.js';
import { forgetPasswordDTO } from './validation/forgetPassword.dto.js';
import { resetPasswordDTO } from './validation/resetPassword.dto.js';
import { userTokenEnum } from '../../common/enum/user.base.enum.js';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signUp(dto) {
        return await this.authService.signUp(dto);
    }
    async signIn(dto) {
        return await this.authService.signIn(dto);
    }
    async signInWithGoogle() { }
    async signInWithGoogleCallBack(user) {
        return await this.authService.signInWithGoogle(user);
    }
    async registerGuest() {
        return this.authService.registerGuest();
    }
    async registerGuestAsUser(dto, user) {
        return this.authService.registerGuestAsUser(user.id, dto);
    }
    async confirmEmail(dto) {
        return this.authService.confirmEmail(dto);
    }
    async refreshToken(authorization) {
        if (!authorization)
            throw new BadRequestException('can not find authorization header');
        return this.authService.refreshToken(authorization);
    }
    async logout(user, req, flag) {
        const TokenDecode = req.decode;
        if (!TokenDecode)
            throw new BadRequestException('invalid token');
        return this.authService.logout(user, TokenDecode, flag);
    }
    async forgetPassword(dto) {
        return this.authService.forgetPassword(dto);
    }
    async confirmOTP(dto) {
        return this.authService.confirmOTP(dto);
    }
    async resendOTP(dto) {
        return this.authService.resendOTP(dto);
    }
    async resetPassword(dto, user) {
        return this.authService.resetPassword(user, dto);
    }
};
__decorate([
    Post('/signup'),
    __param(0, Body(new ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signUpDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    Post('/login'),
    __param(0, Body(new ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signInDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    Get('google'),
    UseGuards(GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signInWithGoogle", null);
__decorate([
    Get('google/callback'),
    UseGuards(GoogleAuthGuard),
    __param(0, User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signInWithGoogleCallBack", null);
__decorate([
    Post('/guest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerGuest", null);
__decorate([
    authenticationGuard(userTokenEnum.access),
    Post('/guest/user'),
    __param(0, Body(new ValidationPipe())),
    __param(1, User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registerGuestAsUserDTO,
        UserModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerGuestAsUser", null);
__decorate([
    Post('/signup/confirm'),
    __param(0, Body(new ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirmEmailDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmEmail", null);
__decorate([
    Get('/refresh'),
    __param(0, Headers('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    authenticationGuard(userTokenEnum.refresh),
    Get('/logout'),
    __param(0, User()),
    __param(1, Req()),
    __param(2, Query('flag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserModel, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    Post('/forget-password'),
    __param(0, Body(new ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgetPasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    Post('/confirm-otp'),
    __param(0, Body(new ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirmEmailDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmOTP", null);
__decorate([
    Post('/resend-otp'),
    __param(0, Body(new ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgetPasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOTP", null);
__decorate([
    authenticationGuard(userTokenEnum.access),
    Get('/reset-password'),
    __param(0, Body(new ValidationPipe())),
    __param(1, User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetPasswordDTO,
        UserModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map