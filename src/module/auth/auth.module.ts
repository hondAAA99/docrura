import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/user.model.js';
import { UsersRepo } from '../../common/repository/user.repo.js';
import securityModule from '../../common/services/security/security.module.js';
import { messageQueueFactory } from '../../common/factories/messageQueue.factory.js';
import { securityServices } from '../../common/services/security/security.service.js';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersRepo, securityServices,ConfigService],
  imports: [TypeOrmModule.forFeature([User]), messageQueueFactory()],
})
export class AuthModule {}
