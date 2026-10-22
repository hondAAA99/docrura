import { UsersRepo } from '../../common/repository/user.repo.js';
import { signUpDTO } from './validation/signUp.dto.js';
import { securityServices } from '../../common/services/security/security.service.js';
import { ClientProxy } from '@nestjs/microservices';
import { signInDTO } from './validation/signin.dto.js';
import { tokenService } from '../../common/services/jwt/tokenService.js';
import { ConfigService } from '@nestjs/config';
import { googleProfileType } from '../../common/types/googleStrategy.type.js';
export declare class AuthService {
    private readonly userRepo;
    private readonly _security;
    private readonly _tokenService;
    private readonly _configService;
    private readonly _messageQueue;
    constructor(userRepo: UsersRepo, _security: securityServices, _tokenService: tokenService, _configService: ConfigService, _messageQueue: ClientProxy);
    signUp(dto: signUpDTO): Promise<{
        message: string;
    }>;
    signIn(dto: signInDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateGoogleProfile(profile: googleProfileType): Promise<import("typeorm").DeepPartial<import("../../database/user.model.js").User> & import("../../database/user.model.js").User>;
    signInWithGoogle(user: googleProfileType): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    registerGuest(): Promise<void>;
    registerGuestAsUser(): Promise<void>;
    confirmEmail(): Promise<void>;
    refreshToken(): Promise<void>;
    logout(): Promise<void>;
    forgetPassword(): Promise<void>;
    confirmOTP(): Promise<void>;
    resendOTP(): Promise<void>;
    resetPassword(): Promise<void>;
}
