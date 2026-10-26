import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tokenService } from '../../services/jwt/tokenService.js';
import { UsersRepo } from '../../repository/user.repo.js';
import { Reflector } from '@nestjs/core';
export declare class tokenVerificationGuard implements CanActivate {
    private readonly _tokenService;
    private readonly _config;
    private readonly _userRepo;
    private readonly reflector;
    constructor(_tokenService: tokenService, _config: ConfigService, _userRepo: UsersRepo, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
