export declare class AuthService {
    constructor();
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
