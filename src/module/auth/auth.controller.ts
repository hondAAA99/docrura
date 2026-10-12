import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  async signUp() {
    return "sign up succeed"
  }
  @Post('/login')
  async signIn() {
    return "login succeed"
  }
  @Post('/guest')
  async registerGuest() {
    return "register guest succeed"
  }
  @Post('/guest/user')
  async registerGuestAsUser() {
    return "register guest as a user succeed"
  }
  @Post('/signup/confirm')
  async confirmEmail() {
    return "confirm email succeed"
  }
  @Get('/refresh')
  async refreshToken() {
    return "refresh and access tokens"
  }
  @Get('/logout')
  async logout() {
    return "logout succeed"
  }
  @Post('/forget-password')
  async forgetPassword() {
    return "forget password succeed"
  }
  @Post('/confirm-otp')
  async confirmOTP() {
    return "confirm otp succeed"
  }
  @Post('/resend-otp')
  async resendOTP() {
    return "resend otp succeed"
  }
  @Get('/reset-password')
  async resetPassword() {
    return "reset password succeed"
  }
}
