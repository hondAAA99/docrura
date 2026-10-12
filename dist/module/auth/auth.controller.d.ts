import { AuthService } from './auth.service.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(): Promise<string>;
    signIn(): Promise<string>;
    registerGuest(): Promise<string>;
    registerGuestAsUser(): Promise<string>;
    confirmEmail(): Promise<string>;
    refreshToken(): Promise<string>;
    logout(): Promise<string>;
    forgetPassword(): Promise<string>;
    confirmOTP(): Promise<string>;
    resendOTP(): Promise<string>;
    resetPassword(): Promise<string>;
}
