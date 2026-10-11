import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  async signUp() {}
  @Post('/login')
  async signIn() {}
  @Post('/guest')
  async registerGuest() {}
  @Post('/guest/user')
  async registerGuestAsUser() {}
  @Post('/signup/confirm')
  async confirmEmail() {}
  @Get('/refresh')
  async refreshToken() {}
  @Get('/logout')
  async logout() {}
  @Post('/forget-password')
  async forgetPassword() {}
  @Post('/confirm-otp')
  async confirmOTP() {}
  @Post('/resend-otp')
  async resendOTP() {}
  @Get('/reset-password')
  async resetPassword() {}
}
