import { AuthService } from './auth.service.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(): Promise<void>;
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
