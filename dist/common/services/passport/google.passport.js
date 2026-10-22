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
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../../module/auth/auth.service.js';
import { passportClientEnum } from '../../enum/passport.enum.js';
let GoogleStrategy = class GoogleStrategy extends PassportStrategy(Strategy, passportClientEnum.google) {
    configService;
    _authService;
    constructor(configService, _authService) {
        super({
            clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
            clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
        this.configService = configService;
        this._authService = _authService;
    }
    async validate(accessToken, refreshToken, profile) {
        return await this._authService.validateGoogleProfile({
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails?.map((email) => ({
                value: email.value,
                verified: email.verified,
            })),
            photos: profile.photos?.map((photo) => ({
                value: photo.value,
            })),
        });
    }
};
GoogleStrategy = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService,
        AuthService])
], GoogleStrategy);
export { GoogleStrategy };
//# sourceMappingURL=google.passport.js.map