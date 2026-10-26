import { UsersRepo } from '../../common/repository/user.repo.js';
import { signUpDTO } from './validation/signUp.dto.js';
import { securityServices } from '../../common/services/security/security.service.js';
import { ClientProxy } from '@nestjs/microservices';
import { signInDTO } from './validation/signin.dto.js';
import { tokenService } from '../../common/services/jwt/tokenService.js';
import { ConfigService } from '@nestjs/config';
import { googleProfileType } from '../../common/types/googleStrategy.type.js';
import { registerGuestAsUserDTO } from './validation/registerGuestAsUser.dto.js';
import { confirmEmailDTO } from './validation/confirmEmail.dto.js';
import redisService from '../../common/services/redis/redis.service.js';
import { revokeTokensRepo } from '../../common/repository/revokeToken.repo.js';
import { User } from '../../database/user.model.js';
import { userPayload } from '../../common/types/userPayload.type.js';
import { forgetPasswordDTO } from './validation/forgetPassword.dto.js';
import { resetPasswordDTO } from './validation/resetPassword.dto.js';
export declare class AuthService {
    private readonly userRepo;
    private readonly revokeTokenRepo;
    private readonly _security;
    private readonly _tokenService;
    private readonly _configService;
    private readonly _cacheService;
    private readonly _messageQueue;
    constructor(userRepo: UsersRepo, revokeTokenRepo: revokeTokensRepo, _security: securityServices, _tokenService: tokenService, _configService: ConfigService, _cacheService: redisService, _messageQueue: ClientProxy);
    signUp(dto: signUpDTO): Promise<{
        message: string;
    }>;
    signIn(dto: signInDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateGoogleProfile(profile: googleProfileType): Promise<import("typeorm").DeepPartial<User> & User>;
    signInWithGoogle(user: googleProfileType): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    registerGuest(): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    registerGuestAsUser(guestId: string, dto: registerGuestAsUserDTO): Promise<{
        message: string;
    }>;
    confirmEmail(dto: confirmEmailDTO): Promise<{
        message: string;
    }>;
    refreshToken(authorization: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: User, TokenDecode: userPayload, flag?: string | undefined): Promise<{
        message: string;
    }>;
    forgetPassword(dto: forgetPasswordDTO): Promise<{
        message: string;
    }>;
    confirmOTP(dto: confirmEmailDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    resendOTP(dto: forgetPasswordDTO): Promise<{
        message: string;
    }>;
    resetPassword(user: User, dto: resetPasswordDTO): Promise<{
        message: string;
    }>;
}
