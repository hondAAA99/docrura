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
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { uuidv7 as uuid } from 'uuidv7';
import { userRoles } from '../../enum/user.base.enum.js';
let tokenService = class tokenService {
    _jwt;
    _config;
    constructor(_jwt, _config) {
        this._jwt = _jwt;
        this._config = _config;
    }
    generateToken(payload, expiresIn, secret) {
        return this._jwt.sign({ ...payload, id: uuid() }, {
            secret,
            expiresIn,
        });
    }
    verifyToken(token, secret) {
        return this._jwt.verify(token, { secret });
    }
    getAccessAndRefreshSecrets(role, _config) {
        let accessSecret;
        let refreshSecret;
        if (role == userRoles.user) {
            refreshSecret = _config.get('SECRET_USER_REFRESH_TOKEN');
            accessSecret = _config.get('SECRET_USER_ACCESS_TOKEN');
        }
        else {
            refreshSecret = _config.get('SECRET_GUEST_REFRESH_TOKEN');
            accessSecret = _config.get('SECRET_GUEST_ACCESS_TOKEN');
        }
        return { accessSecret, refreshSecret };
    }
};
tokenService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JwtService,
        ConfigService])
], tokenService);
export { tokenService };
//# sourceMappingURL=tokenService.js.map