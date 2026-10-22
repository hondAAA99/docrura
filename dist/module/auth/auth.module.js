var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/user.model.js';
import { UsersRepo } from '../../common/repository/user.repo.js';
import { messageQueueFactory } from '../../common/factories/messageQueue.factory.js';
import { securityServices } from '../../common/services/security/security.service.js';
import { ConfigService } from '@nestjs/config';
import { tokenService } from '../../common/services/jwt/tokenService.js';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthGuard } from '../../common/guard/google.guard.js';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        controllers: [AuthController],
        providers: [
            AuthService,
            UsersRepo,
            securityServices,
            ConfigService,
            tokenService,
            JwtService,
            ConfigService,
            GoogleAuthGuard
        ],
        imports: [TypeOrmModule.forFeature([User]), messageQueueFactory()],
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map