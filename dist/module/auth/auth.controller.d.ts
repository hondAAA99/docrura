import { AuthService } from './auth.service.js';
import { signUpDTO } from './validation/signUp.dto.js';
import { signInDTO } from './validation/signin.dto.js';
import type { googleProfileType } from '../../common/types/googleStrategy.type.js';
import { registerGuestAsUserDTO } from './validation/registerGuestAsUser.dto.js';
import { User as UserModel } from '../../database/user.model.js';
import { confirmEmailDTO } from './validation/confirmEmail.dto.js';
import { type Request } from 'express';
import { forgetPasswordDTO } from './validation/forgetPassword.dto.js';
import { resetPasswordDTO } from './validation/resetPassword.dto.js';
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
    registerGuest(): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    registerGuestAsUser(dto: registerGuestAsUserDTO, user: UserModel): Promise<{
        message: string;
    }>;
    confirmEmail(dto: confirmEmailDTO): Promise<{
        message: string;
    }>;
    refreshToken(authorization: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: UserModel, req: Request, flag: string): Promise<{
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
    resetPassword(dto: resetPasswordDTO, user: UserModel): Promise<{
        message: string;
    }>;
}
