import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { securityServices } from './security.service.js';

@Module({
  providers: [securityServices, ConfigService],
  exports: [securityServices],
})
class securityModule {}

export default securityModule;
