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

@Module({
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
export class AuthModule {}
