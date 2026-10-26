var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, NotFoundException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tokenService } from '../../services/jwt/tokenService.js';
import { UsersRepo } from '../../repository/user.repo.js';
import { Reflector } from '@nestjs/core';
import { ACCESS_TOKEN_TYPE } from './authentication.guard.js';
import { userTokenEnum } from '../../enum/user.base.enum.js';
let tokenVerificationGuard = class tokenVerificationGuard {
    _tokenService;
    _config;
    _userRepo;
    reflector;
    constructor(_tokenService, _config, _userRepo, reflector) {
        this._tokenService = _tokenService;
        this._config = _config;
        this._userRepo = _userRepo;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        try {
            const access_type = this.reflector.get(ACCESS_TOKEN_TYPE, context.getHandler);
            const secret_type = access_type == userTokenEnum.access
                ? this._config.get('SECRET_ACCESS_TOKEN')
                : this._config.get('SECRET_REFRESH_TOKEN');
            const decoded = this._tokenService.verifyToken(request.decode.token, secret_type);
            request.decode = { ...decoded, token: request.decode.token };
            const user = await this._userRepo.findOne({ id: decoded.userId });
            if (!user)
                throw new NotFoundException('user not found');
            if (user.credentials > new Date(decoded.iat))
                throw new UnauthorizedException('token expired please login again');
            request.user = user;
            return true;
        }
        catch (err) {
            throw new UnauthorizedException('invalid token');
        }
    }
};
tokenVerificationGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [tokenService,
        ConfigService,
        UsersRepo,
        Reflector])
], tokenVerificationGuard);
export { tokenVerificationGuard };
//# sourceMappingURL=tokenVerification.guard.js.map