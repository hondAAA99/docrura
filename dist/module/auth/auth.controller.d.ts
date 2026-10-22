import { AuthService } from './auth.service.js';
import { signUpDTO } from './validation/signUp.dto.js';
import { signInDTO } from './validation/signin.dto.js';
import type { googleProfileType } from '../../common/types/googleStrategy.type.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(dto: signUpDTO): Promise<{
        message: string;
    }>;
    signIn(dto: signInDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    signInWithGoogle(): Promise<void>;
    signInWithGoogleCallBack(user: googleProfileType): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
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
