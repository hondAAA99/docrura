import { UsersRepo } from '../../common/repository/user.repo.js';
import { signUpDTO } from './validation/signUp.dto.js';
import { securityServices } from '../../common/services/security/security.service.js';
import { ClientProxy } from '@nestjs/microservices';
export declare class AuthService {
    private readonly userRepo;
    private readonly _security;
    private readonly _messageQueue;
    constructor(userRepo: UsersRepo, _security: securityServices, _messageQueue: ClientProxy);
    signUp(dto: signUpDTO): Promise<{
        message: string;
    }>;
    signIn(): Promise<void>;
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
